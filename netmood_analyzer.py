#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NetMood Analyzer - 네트워크 트래픽 감정 분석 도구
CSV 데이터를 파싱하고 감정별 네트워크 트래픽을 분석합니다.
"""

import pandas as pd
import numpy as np
from datetime import datetime
import json
from typing import Dict, List, Tuple
import argparse
import sys

class NetMoodAnalyzer:
    """네트워크 트래픽 감정 분석기"""
    
    def __init__(self):
        self.emotion_mapping = {
            '평온': 'calm',
            '기쁨': 'happy', 
            '불안': 'anxious',
            '화남': 'angry'
        }
        
        self.reverse_emotion_mapping = {v: k for k, v in self.emotion_mapping.items()}
    
    def parse_csv_data(self, csv_text: str) -> pd.DataFrame:
        """
        CSV 텍스트를 파싱하여 DataFrame으로 변환
        
        Args:
            csv_text (str): CSV 형식의 텍스트 데이터
            
        Returns:
            pd.DataFrame: 파싱된 데이터프레임
        """
        try:
            # StringIO를 사용하여 텍스트를 DataFrame으로 변환
            from io import StringIO
            df = pd.read_csv(StringIO(csv_text))
            
            # 데이터 타입 변환
            df['Timestamp'] = pd.to_datetime(df['Timestamp'])
            df['Bytes'] = pd.to_numeric(df['Bytes'])
            df['PacketRate'] = pd.to_numeric(df['PacketRate'])
            df['ProtocolEntropy'] = pd.to_numeric(df['ProtocolEntropy'])
            
            return df
            
        except Exception as e:
            raise ValueError(f"CSV 파싱 중 오류 발생: {str(e)}")
    
    def analyze_emotion_traffic(self, df: pd.DataFrame) -> Dict:
        """
        감정별 트래픽 분석 수행
        
        Args:
            df (pd.DataFrame): 분석할 데이터프레임
            
        Returns:
            Dict: 감정별 통계 정보
        """
        emotion_stats = {}
        
        for emotion_kr, emotion_en in self.emotion_mapping.items():
            emotion_data = df[df['Emotion'] == emotion_kr]
            
            if len(emotion_data) > 0:
                stats = {
                    'count': len(emotion_data),
                    'total_bytes': emotion_data['Bytes'].sum(),
                    'total_packets': emotion_data['PacketRate'].sum(),
                    'avg_bytes': emotion_data['Bytes'].mean(),
                    'avg_packet_rate': emotion_data['PacketRate'].mean(),
                    'avg_entropy': emotion_data['ProtocolEntropy'].mean(),
                    'protocols': emotion_data['Protocol'].value_counts().to_dict(),
                    'unique_ips': emotion_data['SourceIP'].nunique() + emotion_data['DestinationIP'].nunique()
                }
            else:
                stats = {
                    'count': 0,
                    'total_bytes': 0,
                    'total_packets': 0,
                    'avg_bytes': 0,
                    'avg_packet_rate': 0,
                    'avg_entropy': 0,
                    'protocols': {},
                    'unique_ips': 0
                }
            
            emotion_stats[emotion_en] = stats
        
        return emotion_stats
    
    def calculate_emotion_percentages(self, emotion_stats: Dict) -> Dict:
        """
        감정별 비율 계산
        
        Args:
            emotion_stats (Dict): 감정별 통계
            
        Returns:
            Dict: 감정별 백분율
        """
        total_count = sum(stats['count'] for stats in emotion_stats.values())
        
        percentages = {}
        for emotion, stats in emotion_stats.items():
            percentages[emotion] = round((stats['count'] / total_count * 100), 1) if total_count > 0 else 0
        
        return percentages
    
    def generate_time_series_data(self, df: pd.DataFrame) -> Dict:
        """
        시간별 감정 변화 데이터 생성
        
        Args:
            df (pd.DataFrame): 분석할 데이터프레임
            
        Returns:
            Dict: 시간별 감정 데이터
        """
        # 시간별로 그룹화
        df['Hour'] = df['Timestamp'].dt.hour
        df['Minute'] = df['Timestamp'].dt.minute
        df['TimeStr'] = df['Timestamp'].dt.strftime('%H:%M')
        
        time_emotion_counts = df.groupby(['TimeStr', 'Emotion']).size().unstack(fill_value=0)
        
        # 모든 감정 타입에 대해 누락된 컬럼 추가
        for emotion_kr in self.emotion_mapping.keys():
            if emotion_kr not in time_emotion_counts.columns:
                time_emotion_counts[emotion_kr] = 0
        
        # 시간순 정렬
        time_emotion_counts = time_emotion_counts.sort_index()
        
        # 영어 감정명으로 변환
        emotion_counts_en = {}
        for emotion_kr, emotion_en in self.emotion_mapping.items():
            emotion_counts_en[emotion_en] = time_emotion_counts[emotion_kr].tolist()
        
        return {
            'labels': time_emotion_counts.index.tolist(),
            'datasets': emotion_counts_en
        }
    
    def generate_alerts(self, emotion_percentages: Dict) -> List[Dict]:
        """
        감정별 경고 메시지 생성
        
        Args:
            emotion_percentages (Dict): 감정별 백분율
            
        Returns:
            List[Dict]: 경고 메시지 목록
        """
        alerts = []
        
        # 분노 레벨이 높을 때
        if emotion_percentages.get('angry', 0) > 15:
            alerts.append({
                'type': 'danger',
                'icon': '🔥',
                'message': f"긴급! 네트워크 분노 레벨이 {emotion_percentages['angry']}%로 높습니다. 보안 점검이 필요합니다."
            })
        
        # 불안 레벨이 높을 때
        if emotion_percentages.get('anxious', 0) > 25:
            alerts.append({
                'type': 'warning',
                'icon': '⚠️',
                'message': f"주의! 네트워크 불안 수준이 {emotion_percentages['anxious']}%입니다. 모니터링을 강화하세요."
            })
        
        # 평온 레벨이 매우 높을 때
        if emotion_percentages.get('calm', 0) > 60:
            alerts.append({
                'type': 'info',
                'icon': '✅',
                'message': f"양호! 네트워크 상태가 안정적입니다. 평온 수준이 {emotion_percentages['calm']}%입니다."
            })
        
        # 알림이 없을 때
        if not alerts:
            alerts.append({
                'type': 'info',
                'icon': '📊',
                'message': '현재 모든 감정 지표가 정상 범위입니다.'
            })
        
        return alerts
    
    def generate_summary(self, df: pd.DataFrame, emotion_percentages: Dict, emotion_stats: Dict) -> str:
        """
        분석 결과 요약 생성
        
        Args:
            df (pd.DataFrame): 원본 데이터
            emotion_percentages (Dict): 감정별 백분율
            emotion_stats (Dict): 감정별 통계
            
        Returns:
            str: 요약 텍스트
        """
        total_records = len(df)
        total_bytes = df['Bytes'].sum()
        avg_entropy = df['ProtocolEntropy'].mean()
        
        # 주요 감정 찾기
        dominant_emotion = max(emotion_percentages.items(), key=lambda x: x[1])
        
        summary_parts = []
        
        if dominant_emotion[0] == 'calm':
            summary_parts.append(f"네트워크가 평온한 상태입니다. 전체 {total_records}개 레코드 중 {emotion_percentages['calm']}%가 안정적인 패턴을 보이며, 평균 엔트로피 {avg_entropy:.2f}로 시스템이 원활하게 작동하고 있습니다.")
        elif dominant_emotion[0] == 'happy':
            summary_parts.append(f"네트워크가 건전한 활동을 보이고 있습니다. {emotion_percentages['happy']}%의 트래픽이 정상적인 통신 패턴을 나타내며, 총 {total_bytes/1024:.1f}KB의 데이터가 처리되었습니다.")
        elif dominant_emotion[0] == 'anxious':
            summary_parts.append(f"네트워크에서 불안한 패턴이 감지되었습니다. {emotion_percentages['anxious']}%의 트래픽이 비정상적인 활동을 보이며, 평균 엔트로피 {avg_entropy:.2f}로 추가 모니터링이 필요합니다.")
        elif dominant_emotion[0] == 'angry':
            summary_parts.append(f"경고! 네트워크에서 위험한 패턴이 발견되었습니다. {emotion_percentages['angry']}%의 트래픽이 악성 활동을 나타내며, 즉시 보안 조치를 취해야 합니다.")
        
        # 상세 통계 추가
        summary_parts.append("\n📊 상세 통계:")
        for emotion_en, emotion_kr in self.reverse_emotion_mapping.items():
            count = emotion_stats[emotion_en]['count']
            avg_ent = emotion_stats[emotion_en]['avg_entropy']
            summary_parts.append(f"• {emotion_kr}: {count}건 ({avg_ent:.2f} avg entropy)")
        
        return '\n'.join(summary_parts)
    
    def analyze(self, csv_text: str) -> Dict:
        """
        전체 분석 수행
        
        Args:
            csv_text (str): CSV 형식의 텍스트 데이터
            
        Returns:
            Dict: 분석 결과
        """
        # CSV 데이터 파싱
        df = self.parse_csv_data(csv_text)
        
        # 감정별 트래픽 분석
        emotion_stats = self.analyze_emotion_traffic(df)
        
        # 감정별 비율 계산
        emotion_percentages = self.calculate_emotion_percentages(emotion_stats)
        
        # 시간별 데이터 생성
        time_series_data = self.generate_time_series_data(df)
        
        # 경고 메시지 생성
        alerts = self.generate_alerts(emotion_percentages)
        
        # 요약 생성
        summary = self.generate_summary(df, emotion_percentages, emotion_stats)
        
        return {
            'emotion_percentages': emotion_percentages,
            'emotion_stats': emotion_stats,
            'time_series_data': time_series_data,
            'alerts': alerts,
            'summary': summary,
            'total_records': len(df),
            'total_bytes': df['Bytes'].sum(),
            'avg_entropy': df['ProtocolEntropy'].mean()
        }

def main():
    """메인 함수 - CLI 인터페이스"""
    parser = argparse.ArgumentParser(description='NetMood Analyzer - 네트워크 트래픽 감정 분석')
    parser.add_argument('--csv', type=str, help='CSV 파일 경로')
    parser.add_argument('--output', type=str, help='결과 출력 파일 경로 (JSON)')
    parser.add_argument('--demo', action='store_true', help='샘플 데이터로 데모 실행')
    
    args = parser.parse_args()
    
    analyzer = NetMoodAnalyzer()
    
    # 샘플 데이터
    sample_csv = """Timestamp,SourceIP,DestinationIP,Protocol,Bytes,PacketRate,ProtocolEntropy,Emotion
2025-10-03 10:00:00,192.168.0.1,8.8.8.8,TCP,23456,120,0.62,평온
2025-10-03 10:01:00,192.168.0.2,10.0.0.5,UDP,34000,780,0.85,화남
2025-10-03 10:02:00,192.168.0.3,1.1.1.1,ICMP,4500,40,0.55,기쁨
2025-10-03 10:03:00,192.168.0.3,8.8.4.4,TCP,17000,500,0.75,불안
2025-10-03 10:04:00,192.168.0.4,20.1.1.2,TCP,20000,230,0.68,평온
2025-10-03 10:05:00,192.168.0.5,8.8.8.8,TCP,15000,180,0.45,평온
2025-10-03 10:06:00,192.168.0.6,10.0.0.1,UDP,50000,920,0.92,화남
2025-10-03 10:07:00,192.168.0.7,1.1.1.1,TCP,28000,350,0.58,기쁨
2025-10-03 10:08:00,192.168.0.8,8.8.4.4,ICMP,8000,60,0.42,평온
2025-10-03 10:09:00,192.168.0.9,20.1.1.2,TCP,32000,480,0.78,불안"""
    
    try:
        if args.demo or not args.csv:
            print("🎯 샘플 데이터로 분석을 시작합니다...")
            csv_text = sample_csv
        else:
            print(f"📁 CSV 파일을 읽는 중: {args.csv}")
            with open(args.csv, 'r', encoding='utf-8') as f:
                csv_text = f.read()
        
        print("🔄 네트워크 트래픽 감정 분석을 수행 중...")
        result = analyzer.analyze(csv_text)
        
        print("\n✅ 분석 완료!")
        print("=" * 50)
        print("📊 감정별 분석 결과:")
        for emotion, percentage in result['emotion_percentages'].items():
            emotion_kr = analyzer.reverse_emotion_mapping[emotion]
            print(f"  {emotion_kr}: {percentage}%")
        
        print("\n🚨 경고 메시지:")
        for alert in result['alerts']:
            print(f"  {alert['icon']} {alert['message']}")
        
        print(f"\n📋 요약:")
        print(result['summary'])
        
        # JSON 파일로 저장
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(f"\n💾 결과가 {args.output}에 저장되었습니다.")
        
        return result
        
    except Exception as e:
        print(f"❌ 오류 발생: {str(e)}", file=sys.stderr)
        return None

if __name__ == "__main__":
    main()
