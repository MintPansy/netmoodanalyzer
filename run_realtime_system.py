#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NetMood Analyzer - 실시간 시스템 통합 실행 스크립트
패킷 캡처, 감정 분석, 웹 대시보드를 통합한 완전한 시스템
"""

import asyncio
import argparse
import logging
import signal
import sys
import threading
import time
from pathlib import Path
from typing import Optional

# 프로젝트 모듈 import
try:
    from realtime_capture import NetMoodRealtimeSystem, PrivacySettings
    from security_config import SecurityManager, SecuritySettings, PrivacySettings as SecurityPrivacySettings
    from netmood_analyzer import NetMoodAnalyzer
except ImportError as e:
    print(f"필수 모듈을 찾을 수 없습니다: {e}")
    print("다음 파일들이 같은 디렉토리에 있는지 확인하세요:")
    print("- realtime_capture.py")
    print("- security_config.py") 
    print("- netmood_analyzer.py")
    sys.exit(1)

# Flask 웹 서버 (선택적)
try:
    from flask import Flask, send_from_directory, request, jsonify, render_template_string
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

class NetMoodSystemManager:
    """NetMood 시스템 통합 관리자"""
    
    def __init__(self, config: dict):
        self.config = config
        self.realtime_system: Optional[NetMoodRealtimeSystem] = None
        self.security_manager: Optional[SecurityManager] = None
        self.web_server: Optional[Flask] = None
        self.is_running = False
        
        # 로깅 설정
        self._setup_logging()
        
        # 시그널 핸들러 설정
        self._setup_signal_handlers()
        
        logging.info("NetMood System Manager 초기화 완료")
    
    def _setup_logging(self):
        """로깅 설정"""
        log_level = getattr(logging, self.config.get('log_level', 'INFO').upper())
        
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.StreamHandler(sys.stdout),
                logging.FileHandler('netmood_system.log', encoding='utf-8')
            ]
        )
        
        # 패킷 캡처 로그는 별도 파일로
        packet_logger = logging.getLogger('packet_capture')
        packet_handler = logging.FileHandler('packet_capture.log', encoding='utf-8')
        packet_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
        packet_logger.addHandler(packet_handler)
    
    def _setup_signal_handlers(self):
        """시그널 핸들러 설정"""
        def signal_handler(signum, frame):
            logging.info(f"시그널 {signum} 수신. 시스템 종료 중...")
            self.stop()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
    
    def initialize_system(self):
        """시스템 초기화"""
        try:
            # 보안 설정
            security_settings = SecuritySettings(
                enable_encryption=self.config.get('enable_encryption', True),
                session_timeout_minutes=self.config.get('session_timeout_minutes', 30),
                max_login_attempts=self.config.get('max_login_attempts', 5),
                enable_audit_log=self.config.get('enable_audit_log', True),
                allow_remote_access=self.config.get('allow_remote_access', False),
                trusted_networks=self.config.get('trusted_networks', [])
            )
            
            # 개인정보 보호 설정
            privacy_settings = PrivacySettings(
                anonymize_ips=self.config.get('anonymize_ips', True),
                anonymize_macs=self.config.get('anonymize_macs', True),
                filter_personal_data=self.config.get('filter_personal_data', True),
                local_processing_only=self.config.get('local_processing_only', True),
                auto_data_cleanup=self.config.get('auto_data_cleanup', True),
                data_anonymization_level=self.config.get('data_anonymization_level', 3)
            )
            
            # 보안 관리자 초기화
            self.security_manager = SecurityManager(security_settings, privacy_settings)
            
            # 실시간 시스템 초기화
            self.realtime_system = NetMoodRealtimeSystem(privacy_settings)
            
            logging.info("시스템 초기화 완료")
            return True
            
        except Exception as e:
            logging.error(f"시스템 초기화 실패: {e}")
            return False
    
    def start_realtime_monitoring(self):
        """실시간 모니터링 시작"""
        if not self.realtime_system:
            logging.error("실시간 시스템이 초기화되지 않았습니다")
            return False
        
        try:
            self.realtime_system.start_monitoring()
            self.is_running = True
            logging.info("실시간 모니터링 시작됨")
            return True
        except Exception as e:
            logging.error(f"실시간 모니터링 시작 실패: {e}")
            return False
    
    def start_websocket_server(self, host: str = "localhost", port: int = 8765):
        """웹소켓 서버 시작"""
        if not self.realtime_system:
            logging.error("실시간 시스템이 초기화되지 않았습니다")
            return
        
        try:
            # 웹소켓 서버를 별도 스레드에서 실행
            def run_websocket_server():
                asyncio.run(self.realtime_system.start_websocket_server(host, port))
            
            websocket_thread = threading.Thread(target=run_websocket_server, daemon=True)
            websocket_thread.start()
            
            logging.info(f"웹소켓 서버 시작됨: {host}:{port}")
            
        except Exception as e:
            logging.error(f"웹소켓 서버 시작 실패: {e}")
    
    def start_web_server(self, host: str = "0.0.0.0", port: int = 5000):
        """웹 서버 시작"""
        if not FLASK_AVAILABLE:
            logging.warning("Flask가 설치되지 않았습니다. 웹 서버를 시작할 수 없습니다")
            return
        
        try:
            self.web_server = Flask(__name__)
            CORS(self.web_server)
            
            # 라우트 설정
            self._setup_web_routes()
            
            # 웹 서버를 별도 스레드에서 실행
            def run_web_server():
                self.web_server.run(host=host, port=port, debug=False, threaded=True)
            
            web_thread = threading.Thread(target=run_web_server, daemon=True)
            web_thread.start()
            
            logging.info(f"웹 서버 시작됨: http://{host}:{port}")
            
        except Exception as e:
            logging.error(f"웹 서버 시작 실패: {e}")
    
    def _setup_web_routes(self):
        """웹 라우트 설정"""
        
        @self.web_server.route('/')
        def index():
            """메인 대시보드"""
            try:
                with open('realtime-dashboard.html', 'r', encoding='utf-8') as f:
                    return f.read()
            except FileNotFoundError:
                return "실시간 대시보드 파일을 찾을 수 없습니다", 404
        
        @self.web_server.route('/static/<path:filename>')
        def static_files(filename):
            """정적 파일 서빙"""
            return send_from_directory('.', filename)
        
        @self.web_server.route('/api/status')
        def api_status():
            """시스템 상태 API"""
            if not self.realtime_system:
                return jsonify({"error": "시스템이 초기화되지 않았습니다"}), 500
            
            stats = self.realtime_system.get_current_stats()
            return jsonify(stats)
        
        @self.web_server.route('/api/security-report')
        def api_security_report():
            """보안 보고서 API"""
            if not self.security_manager:
                return jsonify({"error": "보안 관리자가 초기화되지 않았습니다"}), 500
            
            report = self.security_manager.get_security_report()
            return jsonify(report)
        
        @self.web_server.route('/api/export-data')
        def api_export_data():
            """데이터 내보내기 API"""
            if not self.realtime_system:
                return jsonify({"error": "시스템이 초기화되지 않았습니다"}), 500
            
            try:
                filename = self.realtime_system.export_current_data()
                return jsonify({"filename": filename, "message": "데이터 내보내기 완료"})
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.web_server.route('/api/start-monitoring', methods=['POST'])
        def api_start_monitoring():
            """모니터링 시작 API"""
            if not self.realtime_system:
                return jsonify({"error": "시스템이 초기화되지 않았습니다"}), 500
            
            try:
                if self.realtime_system.start_monitoring():
                    return jsonify({"message": "모니터링이 시작되었습니다"})
                else:
                    return jsonify({"error": "모니터링 시작에 실패했습니다"}), 500
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.web_server.route('/api/stop-monitoring', methods=['POST'])
        def api_stop_monitoring():
            """모니터링 중지 API"""
            if not self.realtime_system:
                return jsonify({"error": "시스템이 초기화되지 않았습니다"}), 500
            
            try:
                self.realtime_system.stop_monitoring()
                return jsonify({"message": "모니터링이 중지되었습니다"})
            except Exception as e:
                return jsonify({"error": str(e)}), 500
    
    def run_system_info_display(self):
        """시스템 정보 표시"""
        def display_info():
            while self.is_running:
                try:
                    if self.realtime_system:
                        stats = self.realtime_system.get_current_stats()
                        
                        print("\n" + "="*60)
                        print("🔴 NetMood 실시간 모니터링 시스템")
                        print("="*60)
                        print(f"📊 총 패킷 수: {stats.get('total_packets', 0):,}")
                        print(f"⏱️  모니터링 시간: {stats.get('duration_seconds', 0):.1f}초")
                        print(f"📈 패킷/초: {stats.get('packets_per_second', 0):.1f}")
                        
                        emotion_counts = stats.get('emotion_counts', {})
                        print("\n🎭 감정 분포:")
                        for emotion, count in emotion_counts.items():
                            print(f"   {emotion}: {count}개")
                        
                        if self.security_manager:
                            security_report = self.security_manager.get_security_report()
                            print(f"\n🔒 활성 세션: {security_report.get('active_sessions', 0)}")
                            print(f"🚨 실패 시도 (24h): {security_report.get('failed_attempts_24h', 0)}")
                        
                        print("\n📱 웹 대시보드: http://localhost:5000")
                        print("🔌 웹소켓 서버: ws://localhost:8765")
                        print("="*60)
                    
                    time.sleep(10)  # 10초마다 업데이트
                    
                except Exception as e:
                    logging.error(f"시스템 정보 표시 오류: {e}")
                    time.sleep(5)
        
        info_thread = threading.Thread(target=display_info, daemon=True)
        info_thread.start()
    
    def stop(self):
        """시스템 중지"""
        logging.info("시스템 중지 중...")
        
        self.is_running = False
        
        if self.realtime_system:
            try:
                self.realtime_system.stop_monitoring()
                logging.info("실시간 모니터링 중지됨")
            except Exception as e:
                logging.error(f"모니터링 중지 오류: {e}")
        
        if self.security_manager:
            try:
                self.security_manager.save_security_policies()
                logging.info("보안 정책 저장됨")
            except Exception as e:
                logging.error(f"보안 정책 저장 오류: {e}")
        
        logging.info("시스템이 안전하게 중지되었습니다")

def load_config(config_file: str = "netmood_config.json") -> dict:
    """설정 파일 로드"""
    default_config = {
        "log_level": "INFO",
        "enable_encryption": True,
        "anonymize_ips": True,
        "filter_personal_data": True,
        "local_processing_only": True,
        "data_anonymization_level": 3,
        "websocket_host": "localhost",
        "websocket_port": 8765,
        "web_host": "0.0.0.0",
        "web_port": 5000,
        "session_timeout_minutes": 30,
        "max_login_attempts": 5,
        "trusted_networks": []
    }
    
    if Path(config_file).exists():
        try:
            import json
            with open(config_file, 'r', encoding='utf-8') as f:
                user_config = json.load(f)
                default_config.update(user_config)
        except Exception as e:
            logging.warning(f"설정 파일 로드 실패: {e}. 기본 설정을 사용합니다.")
    
    return default_config

def create_default_config(config_file: str = "netmood_config.json"):
    """기본 설정 파일 생성"""
    config = {
        "log_level": "INFO",
        "enable_encryption": True,
        "anonymize_ips": True,
        "anonymize_macs": True,
        "filter_personal_data": True,
        "local_processing_only": True,
        "auto_data_cleanup": True,
        "data_anonymization_level": 3,
        "consent_required": True,
        "gdpr_compliant": True,
        "websocket_host": "localhost",
        "websocket_port": 8765,
        "web_host": "0.0.0.0",
        "web_port": 5000,
        "session_timeout_minutes": 30,
        "max_login_attempts": 5,
        "enable_audit_log": True,
        "allow_remote_access": False,
        "trusted_networks": ["192.168.0.0/16", "10.0.0.0/8"]
    }
    
    import json
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"기본 설정 파일이 생성되었습니다: {config_file}")

def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(description="NetMood 실시간 분석 시스템")
    parser.add_argument('--config', type=str, default='netmood_config.json',
                       help='설정 파일 경로')
    parser.add_argument('--create-config', action='store_true',
                       help='기본 설정 파일 생성')
    parser.add_argument('--websocket-port', type=int, default=8765,
                       help='웹소켓 서버 포트')
    parser.add_argument('--web-port', type=int, default=5000,
                       help='웹 서버 포트')
    parser.add_argument('--no-web', action='store_true',
                       help='웹 서버 시작 안함')
    parser.add_argument('--no-websocket', action='store_true',
                       help='웹소켓 서버 시작 안함')
    parser.add_argument('--debug', action='store_true',
                       help='디버그 모드')
    
    args = parser.parse_args()
    
    # 기본 설정 파일 생성
    if args.create_config:
        create_default_config(args.config)
        return
    
    # 설정 로드
    config = load_config(args.config)
    
    # 명령행 인수로 설정 덮어쓰기
    if args.debug:
        config['log_level'] = 'DEBUG'
    if args.websocket_port:
        config['websocket_port'] = args.websocket_port
    if args.web_port:
        config['web_port'] = args.web_port
    
    # 시스템 관리자 초기화
    system_manager = NetMoodSystemManager(config)
    
    try:
        # 시스템 초기화
        if not system_manager.initialize_system():
            print("시스템 초기화에 실패했습니다.")
            return 1
        
        # 실시간 모니터링 시작
        if not system_manager.start_realtime_monitoring():
            print("실시간 모니터링 시작에 실패했습니다.")
            return 1
        
        # 웹소켓 서버 시작
        if not args.no_websocket:
            system_manager.start_websocket_server(
                config['websocket_host'], 
                config['websocket_port']
            )
        
        # 웹 서버 시작
        if not args.no_web:
            system_manager.start_web_server(
                config['web_host'], 
                config['web_port']
            )
        
        # 시스템 정보 표시
        system_manager.run_system_info_display()
        
        print("\n🚀 NetMood 실시간 분석 시스템이 시작되었습니다!")
        print("📱 웹 대시보드: http://localhost:{}".format(config['web_port']))
        print("🔌 웹소켓: ws://localhost:{}".format(config['websocket_port']))
        print("⏹️  종료하려면 Ctrl+C를 누르세요\n")
        
        # 메인 루프
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        
        return 0
        
    except Exception as e:
        logging.error(f"시스템 실행 중 오류 발생: {e}")
        return 1
    
    finally:
        system_manager.stop()

if __name__ == "__main__":
    sys.exit(main())
