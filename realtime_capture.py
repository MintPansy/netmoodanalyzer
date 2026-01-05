#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NetMood Analyzer - 실시간 네트워크 트래픽 캡처 및 분석 시스템
크로스 플랫폼 패킷 캡처와 AI 감정 분석을 통합한 실시간 모니터링 도구
"""

import asyncio
import json
import time
import hashlib
import platform
from datetime import datetime
from typing import Dict, List, Optional, Callable
import logging
from dataclasses import dataclass, asdict
import threading
import queue

# 패킷 캡처 라이브러리 (크로스 플랫폼)
try:
    import scapy
    from scapy.all import *
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False

try:
    import pcapy
    PCAPY_AVAILABLE = True
except ImportError:
    PCAPY_AVAILABLE = False

# 대안 라이브러리들
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

# 웹소켓 통신
try:
    import websockets
    from websockets.server import serve
    WEBSOCKETS_AVAILABLE = True
except ImportError:
    WEBSOCKETS_AVAILABLE = False

# AI 감정 분석
from netmood_analyzer import NetMoodAnalyzer

@dataclass
class NetworkPacket:
    """네트워크 패킷 데이터 구조"""
    timestamp: str
    source_ip: str
    destination_ip: str
    protocol: str
    bytes: int
    packet_rate: float
    protocol_entropy: float
    emotion: str = "평온"  # 기본값

@dataclass
class PrivacySettings:
    """개인정보 보호 설정"""
    anonymize_ips: bool = True
    filter_sensitive_data: bool = True
    max_data_retention_hours: int = 24
    local_processing_only: bool = True

class NetworkCaptureEngine:
    """크로스 플랫폼 네트워크 캡처 엔진"""
    
    def __init__(self, privacy_settings: PrivacySettings = None):
        self.privacy_settings = privacy_settings or PrivacySettings()
        self.is_capturing = False
        self.packet_queue = queue.Queue(maxsize=1000)
        self.callbacks: List[Callable] = []
        self.system = platform.system().lower()
        
        # 플랫폼별 캡처 방법 설정
        self.capture_method = self._detect_capture_method()
        
        # 통계 데이터
        self.stats = {
            'total_packets': 0,
            'start_time': None,
            'emotion_counts': {'평온': 0, '기쁨': 0, '불안': 0, '화남': 0, '슬픔': 0}
        }
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _detect_capture_method(self) -> str:
        """플랫폼에 따른 최적의 캡처 방법 감지"""
        if SCAPY_AVAILABLE:
            return 'scapy'
        elif PCAPY_AVAILABLE:
            return 'pcapy'
        elif PSUTIL_AVAILABLE:
            return 'psutil'
        else:
            return 'simulation'
    
    def _anonymize_ip(self, ip: str) -> str:
        """IP 주소 익명화"""
        if not self.privacy_settings.anonymize_ips:
            return ip
        
        # 마지막 옥텟을 해시로 대체
        if '.' in ip:  # IPv4
            parts = ip.split('.')
            hash_obj = hashlib.md5(parts[3].encode())
            parts[3] = str(int(hash_obj.hexdigest()[:2], 16))
            return '.'.join(parts)
        else:  # IPv6
            return "::1"  # 로컬호스트로 대체
    
    def _calculate_protocol_entropy(self, packet_data: bytes) -> float:
        """패킷 데이터의 엔트로피 계산"""
        if not packet_data:
            return 0.0
        
        # 바이트 빈도 계산
        byte_counts = [0] * 256
        for byte in packet_data:
            byte_counts[byte] += 1
        
        # 엔트로피 계산
        total_bytes = len(packet_data)
        entropy = 0.0
        for count in byte_counts:
            if count > 0:
                probability = count / total_bytes
                entropy -= probability * (probability.bit_length() - 1)
        
        return min(entropy / 8.0, 1.0)  # 0-1 범위로 정규화
    
    def _analyze_packet_emotion(self, packet: NetworkPacket) -> str:
        """패킷을 기반으로 감정 분석"""
        # 간단한 규칙 기반 감정 분석
        entropy = packet.protocol_entropy
        bytes_count = packet.bytes
        packet_rate = packet.packet_rate
        
        # 높은 엔트로피와 큰 패킷 크기는 불안/화남으로 분류
        if entropy > 0.8 and bytes_count > 50000:
            return "화남"
        elif entropy > 0.6 and packet_rate > 500:
            return "불안"
        elif bytes_count < 1000 and packet_rate < 100:
            return "슬픔"
        elif packet_rate > 1000 and entropy < 0.3:
            return "기쁨"
        else:
            return "평온"
    
    def _capture_with_scapy(self):
        """Scapy를 사용한 패킷 캡처"""
        def packet_handler(packet):
            try:
                if IP in packet:
                    src_ip = packet[IP].src
                    dst_ip = packet[IP].dst
                    protocol = packet[IP].proto
                    
                    # IP 익명화
                    src_ip = self._anonymize_ip(src_ip)
                    dst_ip = self._anonymize_ip(dst_ip)
                    
                    # 패킷 데이터 추출
                    packet_data = bytes(packet)
                    packet_size = len(packet_data)
                    
                    # 엔트로피 계산
                    entropy = self._calculate_protocol_entropy(packet_data)
                    
                    # 네트워크 패킷 객체 생성
                    net_packet = NetworkPacket(
                        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        source_ip=src_ip,
                        destination_ip=dst_ip,
                        protocol=self._get_protocol_name(protocol),
                        bytes=packet_size,
                        packet_rate=0.0,  # 별도 계산 필요
                        protocol_entropy=entropy
                    )
                    
                    # 감정 분석
                    net_packet.emotion = self._analyze_packet_emotion(net_packet)
                    
                    # 큐에 추가
                    try:
                        self.packet_queue.put_nowait(net_packet)
                    except queue.Full:
                        self.logger.warning("Packet queue is full, dropping packet")
                        
            except Exception as e:
                self.logger.error(f"Error processing packet: {e}")
        
        # 패킷 캡처 시작
        sniff(prn=packet_handler, store=0, stop_filter=lambda x: not self.is_capturing)
    
    def _capture_with_psutil(self):
        """psutil을 사용한 네트워크 통계 수집"""
        while self.is_capturing:
            try:
                # 네트워크 인터페이스 통계 수집
                net_io = psutil.net_io_counters(pernic=True)
                
                for interface, stats in net_io.items():
                    if stats.bytes_sent > 0 or stats.bytes_recv > 0:
                        # 시뮬레이션된 패킷 데이터 생성
                        net_packet = NetworkPacket(
                            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                            source_ip=self._anonymize_ip("192.168.1.100"),
                            destination_ip=self._anonymize_ip("8.8.8.8"),
                            protocol="TCP",
                            bytes=stats.bytes_sent + stats.bytes_recv,
                            packet_rate=stats.packets_sent + stats.packets_recv,
                            protocol_entropy=0.5  # 기본값
                        )
                        
                        # 감정 분석
                        net_packet.emotion = self._analyze_packet_emotion(net_packet)
                        
                        try:
                            self.packet_queue.put_nowait(net_packet)
                        except queue.Full:
                            pass
                
                time.sleep(1)  # 1초마다 수집
                
            except Exception as e:
                self.logger.error(f"Error in psutil capture: {e}")
                time.sleep(5)
    
    def _get_protocol_name(self, protocol_num: int) -> str:
        """프로토콜 번호를 이름으로 변환"""
        protocols = {
            1: "ICMP",
            6: "TCP", 
            17: "UDP",
            47: "GRE",
            50: "ESP",
            51: "AH"
        }
        return protocols.get(protocol_num, f"Protocol-{protocol_num}")
    
    def start_capture(self):
        """패킷 캡처 시작"""
        if self.is_capturing:
            return
        
        self.is_capturing = True
        self.stats['start_time'] = datetime.now()
        
        self.logger.info(f"Starting network capture using {self.capture_method}")
        
        if self.capture_method == 'scapy':
            capture_thread = threading.Thread(target=self._capture_with_scapy)
        elif self.capture_method == 'psutil':
            capture_thread = threading.Thread(target=self._capture_with_psutil)
        else:
            # 시뮬레이션 모드
            capture_thread = threading.Thread(target=self._simulate_capture)
        
        capture_thread.daemon = True
        capture_thread.start()
        
        # 패킷 처리 스레드 시작
        processing_thread = threading.Thread(target=self._process_packets)
        processing_thread.daemon = True
        processing_thread.start()
    
    def _simulate_capture(self):
        """시뮬레이션 모드 - 실제 캡처 대신 테스트 데이터 생성"""
        while self.is_capturing:
            # 시뮬레이션된 패킷 데이터 생성
            emotions = ['평온', '기쁨', '불안', '화남', '슬픔']
            protocols = ['TCP', 'UDP', 'ICMP']
            
            net_packet = NetworkPacket(
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                source_ip=self._anonymize_ip("192.168.1.100"),
                destination_ip=self._anonymize_ip("8.8.8.8"),
                protocol=protocols[hash(str(time.time())) % len(protocols)],
                bytes=hash(str(time.time())) % 50000 + 1000,
                packet_rate=hash(str(time.time())) % 1000 + 100,
                protocol_entropy=(hash(str(time.time())) % 100) / 100.0,
                emotion=emotions[hash(str(time.time())) % len(emotions)]
            )
            
            try:
                self.packet_queue.put_nowait(net_packet)
            except queue.Full:
                pass
            
            time.sleep(0.5)  # 0.5초마다 시뮬레이션 데이터 생성
    
    def _process_packets(self):
        """패킷 큐에서 데이터를 처리하고 콜백 호출"""
        while self.is_capturing:
            try:
                packet = self.packet_queue.get(timeout=1)
                
                # 통계 업데이트
                self.stats['total_packets'] += 1
                self.stats['emotion_counts'][packet.emotion] += 1
                
                # 콜백 함수들 호출
                for callback in self.callbacks:
                    try:
                        callback(packet)
                    except Exception as e:
                        self.logger.error(f"Error in callback: {e}")
                
                self.packet_queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                self.logger.error(f"Error processing packet: {e}")
    
    def stop_capture(self):
        """패킷 캡처 중지"""
        self.is_capturing = False
        self.logger.info("Network capture stopped")
    
    def add_callback(self, callback: Callable):
        """패킷 처리 콜백 함수 추가"""
        self.callbacks.append(callback)
    
    def get_stats(self) -> Dict:
        """현재 통계 정보 반환"""
        if self.stats['start_time']:
            duration = (datetime.now() - self.stats['start_time']).total_seconds()
            self.stats['duration_seconds'] = duration
            self.stats['packets_per_second'] = self.stats['total_packets'] / duration if duration > 0 else 0
        
        return self.stats.copy()
    
    def export_to_csv(self, filename: str = None) -> str:
        """현재까지 캡처된 데이터를 CSV로 내보내기"""
        if not filename:
            filename = f"network_capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        # 큐에 있는 모든 패킷 수집
        packets = []
        while not self.packet_queue.empty():
            try:
                packets.append(self.packet_queue.get_nowait())
            except queue.Empty:
                break
        
        # CSV 파일 생성
        import csv
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=[
                'Timestamp', 'SourceIP', 'DestinationIP', 'Protocol', 
                'Bytes', 'PacketRate', 'ProtocolEntropy', 'Emotion'
            ])
            writer.writeheader()
            
            for packet in packets:
                writer.writerow(asdict(packet))
        
        self.logger.info(f"Exported {len(packets)} packets to {filename}")
        return filename

class RealTimeAnalyzer:
    """실시간 감정 분석기"""
    
    def __init__(self, capture_engine: NetworkCaptureEngine):
        self.capture_engine = capture_engine
        self.analyzer = NetMoodAnalyzer()
        self.recent_packets: List[NetworkPacket] = []
        self.max_recent_packets = 100
        
        # 웹소켓 클라이언트들
        self.websocket_clients = set()
        
        # 분석 결과 저장
        self.current_analysis = None
    
    def _packet_to_csv_row(self, packet: NetworkPacket) -> str:
        """패킷을 CSV 행으로 변환"""
        return f"{packet.timestamp},{packet.source_ip},{packet.destination_ip}," \
               f"{packet.protocol},{packet.bytes},{packet.packet_rate}," \
               f"{packet.protocol_entropy},{packet.emotion}"
    
    def _analyze_recent_packets(self):
        """최근 패킷들을 분석하여 감정 상태 업데이트"""
        if len(self.recent_packets) < 10:  # 최소 10개 패킷 필요
            return
        
        # CSV 형식으로 변환
        csv_data = "Timestamp,SourceIP,DestinationIP,Protocol,Bytes,PacketRate,ProtocolEntropy,Emotion\n"
        csv_data += "\n".join([self._packet_to_csv_row(packet) for packet in self.recent_packets])
        
        try:
            # 감정 분석 수행
            analysis_result = self.analyzer.analyze(csv_data)
            self.current_analysis = analysis_result
            
            # 웹소켓 클라이언트들에게 결과 전송
            self._broadcast_analysis_result(analysis_result)
            
        except Exception as e:
            logging.error(f"Error in real-time analysis: {e}")
    
    def _broadcast_analysis_result(self, analysis_result: Dict):
        """분석 결과를 웹소켓 클라이언트들에게 브로드캐스트"""
        message = {
            'type': 'analysis_update',
            'timestamp': datetime.now().isoformat(),
            'data': analysis_result
        }
        
        # 연결된 모든 웹소켓 클라이언트에게 전송
        for client in list(self.websocket_clients):
            try:
                asyncio.create_task(client.send(json.dumps(message)))
            except Exception as e:
                logging.error(f"Error sending to websocket client: {e}")
                self.websocket_clients.discard(client)
    
    def on_packet_received(self, packet: NetworkPacket):
        """새로운 패킷 수신 시 호출되는 콜백"""
        # 최근 패킷 목록에 추가
        self.recent_packets.append(packet)
        
        # 최대 개수 초과 시 오래된 것 제거
        if len(self.recent_packets) > self.max_recent_packets:
            self.recent_packets = self.recent_packets[-self.max_recent_packets:]
        
        # 주기적으로 분석 수행 (10개 패킷마다)
        if len(self.recent_packets) % 10 == 0:
            self._analyze_recent_packets()
    
    async def websocket_handler(self, websocket, path):
        """웹소켓 연결 처리"""
        self.websocket_clients.add(websocket)
        logging.info(f"WebSocket client connected. Total clients: {len(self.websocket_clients)}")
        
        try:
            # 현재 분석 결과가 있으면 전송
            if self.current_analysis:
                initial_message = {
                    'type': 'initial_data',
                    'timestamp': datetime.now().isoformat(),
                    'data': self.current_analysis
                }
                await websocket.send(json.dumps(initial_message))
            
            # 클라이언트 연결 유지
            async for message in websocket:
                try:
                    data = json.loads(message)
                    if data.get('type') == 'ping':
                        await websocket.send(json.dumps({'type': 'pong'}))
                except json.JSONDecodeError:
                    pass
                    
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.websocket_clients.discard(websocket)
            logging.info(f"WebSocket client disconnected. Total clients: {len(self.websocket_clients)}")

class NetMoodRealtimeSystem:
    """NetMood 실시간 시스템 메인 클래스"""
    
    def __init__(self, privacy_settings: PrivacySettings = None):
        self.privacy_settings = privacy_settings or PrivacySettings()
        self.capture_engine = NetworkCaptureEngine(self.privacy_settings)
        self.analyzer = RealTimeAnalyzer(self.capture_engine)
        
        # 패킷 수신 콜백 등록
        self.capture_engine.add_callback(self.analyzer.on_packet_received)
        
        logging.info("NetMood Real-time System initialized")
    
    def start_monitoring(self):
        """실시간 모니터링 시작"""
        self.capture_engine.start_capture()
        logging.info("Real-time monitoring started")
    
    def stop_monitoring(self):
        """실시간 모니터링 중지"""
        self.capture_engine.stop_capture()
        logging.info("Real-time monitoring stopped")
    
    def get_current_stats(self) -> Dict:
        """현재 통계 정보 반환"""
        stats = self.capture_engine.get_stats()
        stats['analysis_result'] = self.analyzer.current_analysis
        return stats
    
    async def start_websocket_server(self, host: str = "localhost", port: int = 8765):
        """웹소켓 서버 시작"""
        if not WEBSOCKETS_AVAILABLE:
            logging.error("WebSockets library not available")
            return
        
        logging.info(f"Starting WebSocket server on {host}:{port}")
        async with serve(self.analyzer.websocket_handler, host, port):
            await asyncio.Future()  # 무한 대기
    
    def export_current_data(self) -> str:
        """현재까지의 데이터를 CSV로 내보내기"""
        return self.capture_engine.export_to_csv()

def main():
    """메인 함수"""
    # 개인정보 보호 설정
    privacy_settings = PrivacySettings(
        anonymize_ips=True,
        filter_sensitive_data=True,
        max_data_retention_hours=24,
        local_processing_only=True
    )
    
    # 시스템 초기화
    system = NetMoodRealtimeSystem(privacy_settings)
    
    try:
        # 실시간 모니터링 시작
        system.start_monitoring()
        
        # 웹소켓 서버 시작 (별도 스레드에서)
        def run_websocket_server():
            asyncio.run(system.start_websocket_server())
        
        websocket_thread = threading.Thread(target=run_websocket_server)
        websocket_thread.daemon = True
        websocket_thread.start()
        
        logging.info("NetMood Real-time System is running...")
        logging.info("Press Ctrl+C to stop")
        
        # 메인 루프
        while True:
            time.sleep(10)
            
            # 통계 정보 출력
            stats = system.get_current_stats()
            logging.info(f"Captured {stats['total_packets']} packets")
            logging.info(f"Emotion distribution: {stats['emotion_counts']}")
            
    except KeyboardInterrupt:
        logging.info("Stopping NetMood Real-time System...")
        system.stop_monitoring()
        
        # 최종 데이터 내보내기
        filename = system.export_current_data()
        logging.info(f"Final data exported to: {filename}")

if __name__ == "__main__":
    main()
