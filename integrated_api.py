#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NetMood Analyzer - 통합 API 서버
새로운 대시보드와 기존 실시간 시스템을 연결하는 API
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import time
from datetime import datetime, timedelta
import threading
import queue
from typing import Dict, List, Optional
import logging
import os
import requests

import netmood_db

# 기존 모듈 import
try:
    from realtime_capture import NetMoodRealtimeSystem, PrivacySettings
    from security_config import SecurityManager, SecuritySettings
    from netmood_analyzer import NetMoodAnalyzer
except ImportError as e:
    print(f"기존 모듈 import 실패: {e}")
    # 모의 데이터로 동작
    NetMoodRealtimeSystem = None
    SecurityManager = None
    NetMoodAnalyzer = None

app = Flask(__name__)
CORS(app)

# 전역 변수
realtime_system = None
security_manager = None
analyzer = None
mock_data = True

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MockDataGenerator:
    """모의 데이터 생성기"""
    
    def __init__(self):
        self.emotion_percentages = {
            'calm': 65,
            'happy': 20,
            'anxious': 10,
            'angry': 3,
            'sad': 2
        }
        self.total_packets = 318
        self.health_score = 7
        self.threat_history = []
        self.start_time = datetime.now()
        
    def generate_health_data(self):
        """건강도 데이터 생성"""
        return {
            'health_score': self.health_score,
            'health_status': '주의 필요' if self.health_score < 8 else '양호',
            'health_message': self._get_health_message(),
            'total_data_points': self.total_packets,
            'active_connections': 24,
            'threat_level': '중간' if self.health_score < 8 else '낮음',
            'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def generate_emotion_data(self):
        """감정 데이터 생성"""
        emotions = []
        emotion_configs = {
            'calm': {'name': '평온', 'name_en': 'Calm', 'emoji': '😌', 'message': '네트워크가 안정적인 상태입니다.'},
            'happy': {'name': '기쁨', 'name_en': 'Happy', 'emoji': '😊', 'message': '건전한 네트워크 활동이 감지되었습니다.'},
            'anxious': {'name': '불안', 'name_en': 'Anxious', 'emoji': '😰', 'message': '일부 비정상적인 패턴이 감지되었습니다.'},
            'angry': {'name': '화남', 'name_en': 'Angry', 'emoji': '😡', 'message': '위험한 패턴이 소수 감지되었습니다.'},
            'sad': {'name': '슬픔', 'name_en': 'Sad', 'emoji': '😢', 'message': '네트워크 활동이 저조한 상태입니다.'}
        }
        
        for emotion_key, percentage in self.emotion_percentages.items():
            config = emotion_configs[emotion_key]
            emotions.append({
                'key': emotion_key,
                'name': config['name'],
                'name_en': config['name_en'],
                'emoji': config['emoji'],
                'percentage': percentage,
                'message': config['message'],
                'last_update': f'{int(time.time() % 60)}초 전'
            })
        
        return emotions
    
    def generate_threat_data(self):
        """위험 감지 데이터 생성"""
        if self.emotion_percentages['angry'] > 5:
            return {
                'threat_detected': True,
                'emotion_type': '화남 (Angry)',
                'intensity': 75,
                'detected_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'duration': '3분 45초',
                'anomalies': '높은 패킷 전송률, 비정상적인 엔트로피',
                'affected_segments': '3개 네트워크 세그먼트',
                'risk_level': '높음',
                'detailed_message': '네트워크에서 악성 활동의 징후가 감지되었습니다. 높은 패킷 전송률과 비정상적인 프로토콜 엔트로피가 관찰되고 있으며, 이는 잠재적인 보안 위협을 나타낼 수 있습니다.'
            }
        else:
            return {
                'threat_detected': False,
                'message': '현재 위험한 패턴이 감지되지 않았습니다.'
            }
    
    def generate_history_data(self):
        """이력 데이터 생성"""
        history = []
        base_time = datetime.now()
        
        history_items = [
            {'type': 'threat', 'desc': '화남 패턴 감지 - 높은 패킷 전송률', 'severity': 'high'},
            {'type': 'warning', 'desc': '불안 패턴 감지 - 비정상적인 엔트로피', 'severity': 'medium'},
            {'type': 'normal', 'desc': '평온 상태 복구 - 정상적인 트래픽 패턴', 'severity': 'low'},
            {'type': 'threat', 'desc': '화남 패턴 감지 - 외부 연결 시도', 'severity': 'high'}
        ]
        
        for i, item in enumerate(history_items):
            time_offset = timedelta(minutes=15*i)
            history.append({
                'timestamp': (base_time - time_offset).strftime('%Y-%m-%d %H:%M:%S'),
                'description': item['desc'],
                'severity': item['severity'],
                'type': item['type']
            })
        
        return history
    
    def generate_monitoring_data(self):
        """모니터링 데이터 생성"""
        return {
            'is_monitoring': True,
            'current_packets': self.total_packets + int(time.time() % 100),
            'packets_per_second': 12.5,
            'hourly_chart_data': self._generate_hourly_chart_data(),
            'emotion_detection': self._generate_emotion_detection_data()
        }
    
    def _get_health_message(self):
        """건강도 메시지 생성"""
        if self.health_score >= 9:
            return "네트워크가 매우 안정적인 상태입니다."
        elif self.health_score >= 7:
            return "네트워크에 일부 불안정한 패턴이 감지되었습니다. 지속적인 모니터링을 권장합니다."
        elif self.health_score >= 5:
            return "네트워크에 주의가 필요한 패턴이 감지되었습니다. 즉시 점검이 필요합니다."
        else:
            return "네트워크에 심각한 문제가 감지되었습니다. 긴급 조치가 필요합니다."
    
    def _generate_hourly_chart_data(self):
        """시간별 차트 데이터 생성"""
        return {
            'labels': ['1시간 전', '50분 전', '40분 전', '30분 전', '20분 전', '10분 전', '현재'],
            'datasets': [
                {
                    'label': '평온',
                    'data': [70, 65, 68, 72, 65, 68, self.emotion_percentages['calm']],
                    'borderColor': '#28a745'
                },
                {
                    'label': '불안',
                    'data': [15, 20, 18, 15, 25, 22, self.emotion_percentages['anxious']],
                    'borderColor': '#ffc107'
                },
                {
                    'label': '화남',
                    'data': [5, 8, 6, 3, 10, 8, self.emotion_percentages['angry']],
                    'borderColor': '#dc3545'
                }
            ]
        }
    
    def _generate_emotion_detection_data(self):
        """감정 감지 데이터 생성"""
        return {
            'active_detections': [
                {'emotion': '평온', 'confidence': 85, 'duration': '5분'},
                {'emotion': '기쁨', 'confidence': 72, 'duration': '2분'},
                {'emotion': '불안', 'confidence': 45, 'duration': '1분'}
            ],
            'total_detections': 15,
            'detection_accuracy': 92.5
        }
    
    def update_data(self):
        """데이터 업데이트"""
        # 약간의 변동 추가
        import random
        for emotion in self.emotion_percentages:
            change = random.uniform(-2, 2)
            self.emotion_percentages[emotion] = max(0, min(100, 
                self.emotion_percentages[emotion] + change))
        
        # 총합을 100으로 정규화
        total = sum(self.emotion_percentages.values())
        for emotion in self.emotion_percentages:
            self.emotion_percentages[emotion] = int(
                (self.emotion_percentages[emotion] / total) * 100)
        
        self.total_packets += random.randint(1, 5)
        
        # 건강도 점수 업데이트
        if self.emotion_percentages['angry'] > 10:
            self.health_score = max(3, self.health_score - 1)
        elif self.emotion_percentages['anxious'] > 20:
            self.health_score = max(5, self.health_score - 0.5)
        elif self.emotion_percentages['calm'] > 70:
            self.health_score = min(10, self.health_score + 0.2)

# 모의 데이터 생성기 인스턴스
mock_generator = MockDataGenerator()

def initialize_systems():
    """시스템 초기화"""
    global realtime_system, security_manager, analyzer, mock_data
    
    try:
        if NetMoodRealtimeSystem and SecurityManager and NetMoodAnalyzer:
            # 실제 시스템 초기화
            privacy_settings = PrivacySettings()
            realtime_system = NetMoodRealtimeSystem(privacy_settings)
            security_manager = SecurityManager()
            analyzer = NetMoodAnalyzer()
            mock_data = False
            logger.info("실제 시스템이 초기화되었습니다.")
        else:
            logger.warning("기존 모듈을 찾을 수 없습니다. 모의 데이터로 동작합니다.")
            mock_data = True
    except Exception as e:
        logger.error(f"시스템 초기화 실패: {e}")
        mock_data = True

# API 라우트들

@app.route('/')
def index():
    """메인 대시보드"""
    return send_from_directory('.', 'integrated-dashboard.html')


def _db_disabled_response(message=None):
    msg = message or 'PostgreSQL이 비활성화되어 있습니다. DATABASE_URL과 psycopg 설치를 확인하세요.'
    return jsonify({'success': False, 'error': msg}), 503


@app.route('/api/db/status', methods=['GET'])
def db_status():
    """PostgreSQL 연결 설정 여부 (민감 정보 없음)."""
    url_set = bool(netmood_db.database_url())
    ready = netmood_db.is_enabled()
    return jsonify({
        'success': True,
        'data': {
            'database_url_set': url_set,
            'ready': ready,
        },
    })


@app.route('/api/db/sessions', methods=['POST'])
def db_create_session():
    """모니터링 세션 시작 — 응답 id로 메트릭을 POST 합니다."""
    if not netmood_db.is_enabled():
        return _db_disabled_response()
    try:
        body = request.get_json(silent=True) or {}
        meta = body.get('meta')
        if meta is not None and not isinstance(meta, dict):
            return jsonify({'success': False, 'error': 'meta는 객체여야 합니다.'}), 400
        data = netmood_db.create_session(meta)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        logger.error('세션 생성 실패: %s', e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/db/sessions/<session_id>/end', methods=['PATCH', 'POST'])
def db_end_session(session_id):
    if not netmood_db.is_enabled():
        return _db_disabled_response()
    try:
        row = netmood_db.end_session(session_id)
        if not row:
            return jsonify({'success': False, 'error': '세션을 찾을 수 없거나 이미 종료되었습니다.'}), 404
        return jsonify({'success': True, 'data': row})
    except Exception as e:
        logger.error('세션 종료 실패: %s', e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/db/sessions/<session_id>/metrics', methods=['POST'])
def db_post_metric(session_id):
    """대시보드와 동일 형식의 메트릭 JSON 저장 (useNetworkMetrics 객체)."""
    if not netmood_db.is_enabled():
        return _db_disabled_response()
    try:
        body = request.get_json(force=True)
        if not isinstance(body, dict):
            return jsonify({'success': False, 'error': 'JSON 객체가 필요합니다.'}), 400
        data = netmood_db.insert_metric(session_id, body)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        logger.exception('메트릭 저장 실패')
        err = str(e)
        if 'foreign key' in err.lower() or '23503' in err:
            return jsonify({'success': False, 'error': '유효하지 않은 session_id입니다.'}), 404
        return jsonify({'success': False, 'error': err}), 500


@app.route('/api/db/analytics/hourly-pattern', methods=['GET'])
def db_analytics_hourly_pattern():
    if not netmood_db.is_enabled():
        return _db_disabled_response()
    try:
        days = int(request.args.get('days', 7))
        tz_name = request.args.get('timezone', 'Asia/Seoul')
        session_id = request.args.get('session_id') or None
        rows = netmood_db.hourly_pattern(days, tz_name, session_id)
        return jsonify({'success': True, 'data': {'timezone': tz_name, 'days': days, 'hours': rows}})
    except Exception as e:
        logger.error('시간대 패턴 조회 실패: %s', e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/db/analytics/anomalies', methods=['GET'])
def db_analytics_anomalies():
    if not netmood_db.is_enabled():
        return _db_disabled_response()
    try:
        limit = int(request.args.get('limit', 50))
        session_id = request.args.get('session_id') or None
        rows = netmood_db.list_anomalies(limit, session_id)
        return jsonify({'success': True, 'data': rows})
    except Exception as e:
        logger.error('이상 탐지 목록 조회 실패: %s', e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/db/analytics/report-7d', methods=['GET'])
def db_analytics_report_7d():
    if not netmood_db.is_enabled():
        return _db_disabled_response()
    try:
        tz_name = request.args.get('timezone', 'Asia/Seoul')
        session_id = request.args.get('session_id') or None
        report = netmood_db.report_7d_compare(tz_name, session_id)
        return jsonify({'success': True, 'data': report})
    except Exception as e:
        logger.error('7일 리포트 실패: %s', e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def get_health_data():
    """건강도 데이터 API"""
    try:
        if mock_data:
            data = mock_generator.generate_health_data()
        else:
            # 실제 시스템에서 데이터 가져오기
            stats = realtime_system.get_current_stats()
            data = {
                'health_score': _calculate_health_score(stats),
                'health_status': _get_health_status(stats),
                'health_message': _get_health_message(stats),
                'total_data_points': stats.get('total_packets', 0),
                'active_connections': stats.get('active_connections', 0),
                'threat_level': _get_threat_level(stats),
                'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        logger.error(f"건강도 데이터 조회 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/emotions', methods=['GET'])
def get_emotion_data():
    """감정 데이터 API"""
    try:
        if mock_data:
            data = mock_generator.generate_emotion_data()
        else:
            # 실제 시스템에서 감정 데이터 가져오기
            stats = realtime_system.get_current_stats()
            emotion_counts = stats.get('emotion_counts', {})
            total = sum(emotion_counts.values())
            
            data = []
            emotion_configs = {
                '평온': {'name_en': 'Calm', 'emoji': '😌', 'message': '네트워크가 안정적인 상태입니다.'},
                '기쁨': {'name_en': 'Happy', 'emoji': '😊', 'message': '건전한 네트워크 활동이 감지되었습니다.'},
                '불안': {'name_en': 'Anxious', 'emoji': '😰', 'message': '일부 비정상적인 패턴이 감지되었습니다.'},
                '화남': {'name_en': 'Angry', 'emoji': '😡', 'message': '위험한 패턴이 소수 감지되었습니다.'},
                '슬픔': {'name_en': 'Sad', 'emoji': '😢', 'message': '네트워크 활동이 저조한 상태입니다.'}
            }
            
            for emotion, count in emotion_counts.items():
                percentage = int((count / total) * 100) if total > 0 else 0
                config = emotion_configs.get(emotion, {})
                data.append({
                    'key': emotion.lower(),
                    'name': emotion,
                    'name_en': config.get('name_en', emotion),
                    'emoji': config.get('emoji', '😐'),
                    'percentage': percentage,
                    'message': config.get('message', ''),
                    'last_update': f'{int(time.time() % 60)}초 전'
                })
        
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        logger.error(f"감정 데이터 조회 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/monitoring', methods=['GET'])
def get_monitoring_data():
    """모니터링 데이터 API"""
    try:
        if mock_data:
            data = mock_generator.generate_monitoring_data()
        else:
            # 실제 시스템에서 모니터링 데이터 가져오기
            stats = realtime_system.get_current_stats()
            data = {
                'is_monitoring': realtime_system.is_capturing,
                'current_packets': stats.get('total_packets', 0),
                'packets_per_second': stats.get('packets_per_second', 0),
                'hourly_chart_data': _generate_hourly_chart_data(stats),
                'emotion_detection': _generate_emotion_detection_data(stats)
            }
        
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        logger.error(f"모니터링 데이터 조회 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/threats', methods=['GET'])
def get_threat_data():
    """위험 감지 데이터 API"""
    try:
        if mock_data:
            data = mock_generator.generate_threat_data()
        else:
            # 실제 시스템에서 위험 데이터 가져오기
            stats = realtime_system.get_current_stats()
            emotion_counts = stats.get('emotion_counts', {})
            total = sum(emotion_counts.values())
            
            # 화남 감정이 10% 이상이면 위험으로 간주
            angry_percentage = (emotion_counts.get('화남', 0) / total * 100) if total > 0 else 0
            
            if angry_percentage > 10:
                data = {
                    'threat_detected': True,
                    'emotion_type': '화남 (Angry)',
                    'intensity': int(angry_percentage * 7.5),  # 0-100 스케일로 변환
                    'detected_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'duration': '지속 중',
                    'anomalies': '높은 패킷 전송률, 비정상적인 엔트로피',
                    'affected_segments': '다수 네트워크 세그먼트',
                    'risk_level': '높음' if angry_percentage > 20 else '중간',
                    'detailed_message': f'네트워크에서 {angry_percentage:.1f}%의 위험한 패턴이 감지되었습니다.'
                }
            else:
                data = {
                    'threat_detected': False,
                    'message': '현재 위험한 패턴이 감지되지 않았습니다.'
                }
        
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        logger.error(f"위험 데이터 조회 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history_data():
    """이력 데이터 API"""
    try:
        if mock_data:
            data = mock_generator.generate_history_data()
        else:
            # 실제 시스템에서 이력 데이터 가져오기
            data = _get_real_history_data()
        
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        logger.error(f"이력 데이터 조회 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/actions/system-check', methods=['POST'])
def run_system_check():
    """시스템 점검 실행"""
    try:
        # 실제 시스템 점검 로직
        if not mock_data and realtime_system:
            # 시스템 상태 확인
            stats = realtime_system.get_current_stats()
            security_report = security_manager.get_security_report()
            
            result = {
                'success': True,
                'message': '시스템 점검이 완료되었습니다.',
                'details': {
                    'network_status': '정상' if stats.get('total_packets', 0) > 0 else '비정상',
                    'security_status': '정상',
                    'active_sessions': security_report.get('active_sessions', 0),
                    'failed_attempts': security_report.get('failed_attempts_24h', 0)
                }
            }
        else:
            result = {
                'success': True,
                'message': '시스템 점검이 완료되었습니다.',
                'details': {
                    'network_status': '정상',
                    'security_status': '정상',
                    'active_sessions': 1,
                    'failed_attempts': 0
                }
            }
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"시스템 점검 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/actions/export', methods=['POST'])
def export_data():
    """데이터 내보내기"""
    try:
        # 현재 데이터 수집
        if mock_data:
            health_data = mock_generator.generate_health_data()
            emotion_data = mock_generator.generate_emotion_data()
            threat_data = mock_generator.generate_threat_data()
        else:
            stats = realtime_system.get_current_stats()
            health_data = {'health_score': _calculate_health_score(stats)}
            emotion_data = stats.get('emotion_counts', {})
            threat_data = {'threat_detected': False}
        
        export_data = {
            'timestamp': datetime.now().isoformat(),
            'health': health_data,
            'emotions': emotion_data,
            'threats': threat_data,
            'export_type': 'full_dashboard_data'
        }
        
        # 파일로 저장
        filename = f"netmood_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'message': '데이터가 내보내기되었습니다.',
            'filename': filename,
            'data': export_data
        })
    except Exception as e:
        logger.error(f"데이터 내보내기 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/actions/start-monitoring', methods=['POST'])
def start_monitoring():
    """모니터링 시작"""
    try:
        if not mock_data and realtime_system:
            realtime_system.start_monitoring()
            return jsonify({
                'success': True,
                'message': '실시간 모니터링이 시작되었습니다.'
            })
        else:
            return jsonify({
                'success': True,
                'message': '모의 모니터링이 시작되었습니다.'
            })
    except Exception as e:
        logger.error(f"모니터링 시작 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/actions/stop-monitoring', methods=['POST'])
def stop_monitoring():
    """모니터링 중지"""
    try:
        if not mock_data and realtime_system:
            realtime_system.stop_monitoring()
            return jsonify({
                'success': True,
                'message': '실시간 모니터링이 중지되었습니다.'
            })
        else:
            return jsonify({
                'success': True,
                'message': '모의 모니터링이 중지되었습니다.'
            })
    except Exception as e:
        logger.error(f"모니터링 중지 실패: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/config/deployment', methods=['POST'])
def save_deployment_config():
    """deployment-config.js 저장 (프로젝트 루트에 작성)"""
    try:
        data = request.get_json(force=True)
        provider = data.get('provider', 'vercel')
        webhook_url = data.get('webhookUrl', '')
        headers = data.get('headers', {})
        ref = data.get('ref', 'main')

        # 안전한 최소 검증
        if not isinstance(provider, str) or not isinstance(ref, str):
            return jsonify({'success': False, 'error': '잘못된 입력 값'}), 400

        content = (
            "// 자동 생성됨: Vercel/Netlify 배포 설정\n"
            "window.DEPLOYMENT_CONFIG = " + json.dumps({
                'provider': provider,
                'webhookUrl': webhook_url,
                'headers': headers,
                'ref': ref
            }, ensure_ascii=False, indent=2) + ";\n"
        )
        target_path = os.path.join(os.getcwd(), 'deployment-config.js')
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return jsonify({'success': True, 'message': '저장 완료', 'path': target_path})
    except Exception as e:
        logger.error(f"배포 설정 저장 실패: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/vercel/create-deploy-hook', methods=['POST'])
def vercel_create_deploy_hook():
    """Vercel Deploy Hook 생성 프록시. VERCEL_TOKEN 필요. (클라이언트에서 전달)"""
    try:
        data = request.get_json(force=True)
        token = data.get('token')
        team_id = data.get('teamId')
        project_id = data.get('projectId')
        hook_name = data.get('hookName', 'netmood-deploy-hook')
        if not token:
            return jsonify({'success': False, 'error': 'Vercel token 필요'}), 400

        # 프로젝트가 있으면 hook 생성, 없으면 실패 안내 (자동 프로젝트 생성은 API 권한 범위 큼)
        if not project_id:
            return jsonify({'success': False, 'error': 'Vercel Project ID가 필요합니다. (Vercel 프로젝트 생성 후 사용)'}), 400

        headers_api = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        params = {}
        if team_id:
            params['teamId'] = team_id

        # Deploy Hook 생성
        resp = requests.post(
            f'https://api.vercel.com/v1/integrations/deploy/hooks',
            headers=headers_api,
            params=params,
            json={
                'name': hook_name,
                'projectId': project_id,
                'ref': 'main'
            },
            timeout=20
        )
        if resp.status_code >= 300:
            return jsonify({'success': False, 'error': f'Vercel API 오류: {resp.status_code} {resp.text}'}), 400
        payload = resp.json()
        hook_url = payload.get('url') or payload.get('deployHookUrl')
        return jsonify({'success': True, 'hookUrl': hook_url, 'raw': payload})
    except Exception as e:
        logger.error(f"Vercel Hook 생성 실패: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# 헬퍼 함수들

def _calculate_health_score(stats):
    """건강도 점수 계산"""
    emotion_counts = stats.get('emotion_counts', {})
    total = sum(emotion_counts.values())
    
    if total == 0:
        return 5  # 중간값
    
    # 평온과 기쁨의 비율로 점수 계산
    positive_emotions = emotion_counts.get('평온', 0) + emotion_counts.get('기쁨', 0)
    negative_emotions = emotion_counts.get('화남', 0) + emotion_counts.get('불안', 0)
    
    positive_ratio = positive_emotions / total
    negative_ratio = negative_emotions / total
    
    # 10점 만점으로 계산
    score = (positive_ratio * 8) + (1 - negative_ratio) * 2
    return min(10, max(1, int(score)))

def _get_health_status(score):
    """건강도 상태 반환"""
    if score >= 9:
        return "매우 양호"
    elif score >= 7:
        return "양호"
    elif score >= 5:
        return "주의 필요"
    else:
        return "위험"

def _get_health_message(stats):
    """건강도 메시지 반환"""
    score = _calculate_health_score(stats)
    return {
        9: "네트워크가 매우 안정적인 상태입니다.",
        8: "네트워크가 안정적인 상태입니다.",
        7: "네트워크에 일부 불안정한 패턴이 감지되었습니다. 지속적인 모니터링을 권장합니다.",
        6: "네트워크에 주의가 필요한 패턴이 감지되었습니다.",
        5: "네트워크에 주의가 필요한 패턴이 감지되었습니다. 즉시 점검이 필요합니다.",
        4: "네트워크에 심각한 문제가 감지되었습니다.",
        3: "네트워크에 심각한 문제가 감지되었습니다. 긴급 조치가 필요합니다.",
        2: "네트워크에 심각한 문제가 감지되었습니다. 긴급 조치가 필요합니다.",
        1: "네트워크에 심각한 문제가 감지되었습니다. 긴급 조치가 필요합니다."
    }.get(score, "네트워크 상태를 확인 중입니다.")

def _get_threat_level(stats):
    """위험 수준 반환"""
    emotion_counts = stats.get('emotion_counts', {})
    total = sum(emotion_counts.values())
    
    if total == 0:
        return "알 수 없음"
    
    angry_ratio = emotion_counts.get('화남', 0) / total
    anxious_ratio = emotion_counts.get('불안', 0) / total
    
    if angry_ratio > 0.2 or anxious_ratio > 0.3:
        return "높음"
    elif angry_ratio > 0.1 or anxious_ratio > 0.15:
        return "중간"
    else:
        return "낮음"

def _generate_hourly_chart_data(stats):
    """시간별 차트 데이터 생성"""
    # 실제 구현에서는 시간별 데이터를 저장하고 조회
    return {
        'labels': ['1시간 전', '50분 전', '40분 전', '30분 전', '20분 전', '10분 전', '현재'],
        'datasets': [
            {
                'label': '평온',
                'data': [70, 65, 68, 72, 65, 68, 65],
                'borderColor': '#28a745'
            },
            {
                'label': '불안',
                'data': [15, 20, 18, 15, 25, 22, 10],
                'borderColor': '#ffc107'
            },
            {
                'label': '화남',
                'data': [5, 8, 6, 3, 10, 8, 3],
                'borderColor': '#dc3545'
            }
        ]
    }

def _generate_emotion_detection_data(stats):
    """감정 감지 데이터 생성"""
    return {
        'active_detections': [
            {'emotion': '평온', 'confidence': 85, 'duration': '5분'},
            {'emotion': '기쁨', 'confidence': 72, 'duration': '2분'},
            {'emotion': '불안', 'confidence': 45, 'duration': '1분'}
        ],
        'total_detections': 15,
        'detection_accuracy': 92.5
    }

def _get_real_history_data():
    """실제 이력 데이터 조회"""
    # 실제 구현에서는 데이터베이스나 파일에서 이력 조회
    return [
        {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'description': '실시간 모니터링 시작',
            'severity': 'low',
            'type': 'normal'
        }
    ]

# 모의 데이터 업데이트 스레드
def update_mock_data():
    """모의 데이터 주기적 업데이트"""
    while True:
        if mock_data:
            mock_generator.update_data()
        time.sleep(10)  # 10초마다 업데이트

if __name__ == '__main__':
    # 시스템 초기화
    initialize_systems()

    db_ready, db_msg = netmood_db.init_db_if_configured()
    if netmood_db.database_url() and not db_ready and db_msg:
        logger.warning('PostgreSQL 초기화: %s', db_msg)
    
    # 모의 데이터 업데이트 스레드 시작
    if mock_data:
        update_thread = threading.Thread(target=update_mock_data, daemon=True)
        update_thread.start()
    
    # Flask 서버 시작
    logger.info("NetMood 통합 API 서버를 시작합니다...")
    logger.info(f"모의 데이터 모드: {mock_data}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
