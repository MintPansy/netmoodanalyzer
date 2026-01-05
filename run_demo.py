#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NetMood Analyzer 데모 실행 스크립트
"""

from netmood_analyzer import NetMoodAnalyzer
import json

def main():
    """데모 실행"""
    print("🧠 NetMood Analyzer - 네트워크 트래픽 감정 분석 데모")
    print("=" * 60)
    
    # 샘플 CSV 데이터
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
    
    # 분석기 초기화
    analyzer = NetMoodAnalyzer()
    
    try:
        print("📊 샘플 데이터 분석 시작...")
        result = analyzer.analyze(sample_csv)
        
        print("\n✅ 분석 완료!")
        print("\n" + "="*50)
        print("📈 감정별 분석 결과:")
        print("="*50)
        
        for emotion, percentage in result['emotion_percentages'].items():
            emotion_kr = analyzer.reverse_emotion_mapping[emotion]
            stats = result['emotion_stats'][emotion]
            print(f"\n{emotion_kr} ({percentage}%):")
            print(f"  • 레코드 수: {stats['count']}건")
            print(f"  • 총 바이트: {stats['total_bytes']:,} bytes")
            print(f"  • 평균 엔트로피: {stats['avg_entropy']:.3f}")
            print(f"  • 프로토콜 분포: {stats['protocols']}")
        
        print("\n" + "="*50)
        print("🚨 경고 및 알림:")
        print("="*50)
        
        for alert in result['alerts']:
            print(f"\n{alert['icon']} {alert['message']}")
        
        print("\n" + "="*50)
        print("📋 분석 요약:")
        print("="*50)
        print(result['summary'])
        
        print("\n" + "="*50)
        print("📊 전체 통계:")
        print("="*50)
        print(f"• 총 레코드 수: {result['total_records']}건")
        print(f"• 총 데이터 크기: {result['total_bytes']:,} bytes ({result['total_bytes']/1024:.1f} KB)")
        print(f"• 평균 엔트로피: {result['avg_entropy']:.3f}")
        
        # JSON 결과 저장
        with open('analysis_result.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 상세 결과가 'analysis_result.json'에 저장되었습니다.")
        
        return result
        
    except Exception as e:
        print(f"❌ 오류 발생: {str(e)}")
        return None

if __name__ == "__main__":
    main()
