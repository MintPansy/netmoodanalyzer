# 🏗️ NetMood Analyzer - 기술 아키텍처 및 시스템 설계

## 📋 개요

NetMood Analyzer의 실시간 네트워크 트래픽 캡처 및 AI 감정 분석을 위한 완전한 기술 아키텍처 문서입니다.

## 🎯 시스템 아키텍처

### 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                    NetMood Analyzer System                     │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Layer (Web UI)                                       │
│  ├── B2C Dashboard (netmood-dashboard.html)                   │
│  ├── Real-time Dashboard (realtime-dashboard.html)            │
│  └── WebSocket Client                                         │
├─────────────────────────────────────────────────────────────────┤
│  Backend Layer (Python Services)                              │
│  ├── Real-time Capture Engine (realtime_capture.py)          │
│  ├── Emotion Analysis Engine (netmood_analyzer.py)           │
│  ├── Security Manager (security_config.py)                   │
│  └── WebSocket Server                                         │
├─────────────────────────────────────────────────────────────────┤
│  Data Processing Layer                                         │
│  ├── Packet Capture (Scapy/psutil)                           │
│  ├── Data Anonymization                                       │
│  ├── Encryption/Decryption                                    │
│  └── Real-time Streaming                                      │
├─────────────────────────────────────────────────────────────────┤
│  Platform Layer                                                │
│  ├── Windows (WinPcap/Npcap)                                 │
│  ├── macOS (libpcap)                                         │
│  ├── Linux (libpcap)                                         │
│  └── Cross-platform Fallback (psutil)                       │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 기술 스택

### 프론트엔드 기술

#### 1. **HTML5 & CSS3**
- **시맨틱 마크업**: 접근성과 SEO 최적화
- **CSS Grid & Flexbox**: 반응형 레이아웃
- **CSS 애니메이션**: 부드러운 사용자 경험
- **CSS 변수**: 일관된 디자인 시스템

#### 2. **JavaScript (ES6+)**
- **모듈화된 구조**: 유지보수성 향상
- **비동기 처리**: async/await 패턴
- **이벤트 기반 아키텍처**: 실시간 업데이트
- **WebSocket 통신**: 서버와 실시간 연동

#### 3. **Chart.js**
- **인터랙티브 차트**: 사용자 상호작용
- **실시간 업데이트**: 동적 데이터 시각화
- **커스터마이징**: 브랜드에 맞는 디자인
- **성능 최적화**: 대용량 데이터 처리

### 백엔드 기술

#### 1. **Python 3.8+**
```python
# 핵심 라이브러리
import asyncio          # 비동기 처리
import threading        # 멀티스레딩
import queue           # 스레드 간 통신
import websockets      # 실시간 통신
import pandas          # 데이터 분석
import numpy           # 수치 계산
```

#### 2. **패킷 캡처 라이브러리**

##### **Scapy (주요 라이브러리)**
```python
# 크로스 플랫폼 패킷 캡처
from scapy.all import *
sniff(prn=packet_handler, store=0)
```
**장점:**
- 강력한 패킷 조작 기능
- 다양한 프로토콜 지원
- 크로스 플랫폼 호환성
- 실시간 패킷 분석

##### **psutil (대안 라이브러리)**
```python
# 네트워크 통계 수집
import psutil
net_io = psutil.net_io_counters(pernic=True)
```
**장점:**
- 시스템 리소스 정보
- 설치 없이 사용 가능
- 경량화된 구현
- 플랫폼 독립적

##### **pcapy (고성능 대안)**
```python
# 고성능 패킷 캡처
import pcapy
reader = pcapy.open_live(interface, 65536, True, 1000)
```
**장점:**
- C 라이브러리 기반
- 높은 성능
- 메모리 효율성
- 대용량 트래픽 처리

#### 3. **보안 및 암호화**

##### **Cryptography**
```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
```

##### **데이터 암호화**
- **AES-256**: 대칭키 암호화
- **PBKDF2**: 키 파생 함수
- **Fernet**: 안전한 토큰 기반 암호화
- **HMAC**: 메시지 인증 코드

#### 4. **웹소켓 통신**
```python
import websockets
from websockets.server import serve

async def websocket_handler(websocket, path):
    await websocket.send(json.dumps(data))
```

## 🖥️ 플랫폼별 구현

### Windows 환경

#### **필수 라이브러리**
```bash
# Npcap 설치 (WinPcap 대체)
# https://npcap.com/

# Python 패키지 설치
pip install scapy
pip install psutil
pip install websockets
pip install cryptography
```

#### **Windows 전용 최적화**
```python
# Windows 네트워크 인터페이스 감지
def get_windows_interfaces():
    import subprocess
    result = subprocess.run(['ipconfig'], capture_output=True, text=True)
    # 네트워크 인터페이스 파싱
    return interfaces
```

#### **권한 요구사항**
- **관리자 권한**: 패킷 캡처를 위한 필수
- **방화벽 예외**: WebSocket 서버 포트 허용
- **바이러스 백신 예외**: 실시간 캡처 프로세스 허용

### macOS 환경

#### **필수 라이브러리**
```bash
# Homebrew를 통한 libpcap 설치
brew install libpcap

# Python 패키지 설치
pip install scapy
pip install psutil
pip install websockets
```

#### **macOS 전용 최적화**
```python
# macOS 네트워크 인터페이스
def get_macos_interfaces():
    import subprocess
    result = subprocess.run(['ifconfig'], capture_output=True, text=True)
    return interfaces
```

#### **보안 설정**
- **네트워크 접근 권한**: 시스템 환경설정에서 허용
- **방화벽 설정**: 인바운드 연결 허용
- **개발자 도구**: Xcode Command Line Tools 필요

### Linux 환경

#### **필수 라이브러리**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install libpcap-dev python3-dev

# CentOS/RHEL
sudo yum install libpcap-devel python3-devel

# Python 패키지 설치
pip install scapy
pip install psutil
pip install websockets
```

#### **Linux 전용 최적화**
```python
# Linux 네트워크 네임스페이스
def get_linux_interfaces():
    import netifaces
    return netifaces.interfaces()
```

#### **권한 설정**
- **CAP_NET_RAW**: 패킷 캡처 권한
- **포트 바인딩**: 1024 이하 포트 사용 시 sudo 필요
- **SELinux/AppArmor**: 보안 정책 조정

## 🔄 실시간 데이터 파이프라인

### 데이터 흐름

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Packet    │───▶│  Processing  │───▶│   Analysis  │
│  Capture    │    │    Layer     │    │   Engine    │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Network   │    │   Security   │    │  Emotion    │
│ Interface   │    │  Processing  │    │ Detection   │
└─────────────┘    └──────────────┘    └─────────────┘
```

### 1. **패킷 캡처 단계**
```python
class NetworkCaptureEngine:
    def _capture_with_scapy(self):
        def packet_handler(packet):
            # 패킷 파싱 및 구조화
            net_packet = self._parse_packet(packet)
            # 큐에 추가
            self.packet_queue.put_nowait(net_packet)
        
        sniff(prn=packet_handler, store=0)
```

### 2. **데이터 처리 단계**
```python
def _process_packets(self):
    while self.is_capturing:
        packet = self.packet_queue.get(timeout=1)
        
        # 보안 처리
        processed_packet = self.security_manager.process_network_data(packet)
        
        # 콜백 호출
        for callback in self.callbacks:
            callback(processed_packet)
```

### 3. **감정 분석 단계**
```python
def _analyze_recent_packets(self):
    # CSV 형식으로 변환
    csv_data = self._packets_to_csv(self.recent_packets)
    
    # AI 감정 분석
    analysis_result = self.analyzer.analyze(csv_data)
    
    # 실시간 브로드캐스트
    self._broadcast_analysis_result(analysis_result)
```

## 🔒 보안 아키텍처

### 다층 보안 모델

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Network Security                                 │
│  ├── Firewall Rules                                       │
│  ├── Network Segmentation                                 │
│  └── VPN/Encrypted Tunnels                               │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Application Security                            │
│  ├── Authentication & Authorization                       │
│  ├── Session Management                                   │
│  └── Input Validation                                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Data Security                                   │
│  ├── Encryption at Rest                                   │
│  ├── Encryption in Transit                                │
│  └── Data Anonymization                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Privacy Protection                              │
│  ├── GDPR Compliance                                      │
│  ├── Data Minimization                                    │
│  └── Consent Management                                   │
└─────────────────────────────────────────────────────────────┘
```

### 개인정보 보호 전략

#### 1. **데이터 익명화**
```python
class DataAnonymizer:
    def anonymize_ip(self, ip: str) -> str:
        # 레벨별 익명화
        if level >= 5:
            return "127.0.0.1"  # 완전 익명화
        elif level >= 3:
            # 해시 기반 익명화
            hash_obj = hashlib.sha256(f"{ip}{salt}".encode())
            return f"192.168.{hash_octet1}.{hash_octet2}"
```

#### 2. **데이터 분류**
```python
class DataClassification:
    PUBLIC = "public"           # 공개 데이터
    INTERNAL = "internal"       # 내부 사용
    CONFIDENTIAL = "confidential"  # 기밀 데이터
    RESTRICTED = "restricted"   # 제한 데이터
```

#### 3. **자동 데이터 정리**
```python
def should_retain_data(self, timestamp: str, classification: str) -> bool:
    retention_periods = {
        DataClassification.PUBLIC: 30,      # 30일
        DataClassification.INTERNAL: 7,     # 7일
        DataClassification.CONFIDENTIAL: 1, # 1일
        DataClassification.RESTRICTED: 0    # 즉시 삭제
    }
```

## 📊 성능 최적화

### 메모리 관리

#### 1. **큐 기반 버퍼링**
```python
# 제한된 크기의 큐로 메모리 사용량 제어
self.packet_queue = queue.Queue(maxsize=1000)

# 오래된 데이터 자동 제거
if len(self.recent_packets) > self.max_recent_packets:
    self.recent_packets = self.recent_packets[-self.max_recent_packets:]
```

#### 2. **지연 로딩**
```python
# 필요할 때만 차트 생성
def create_chart_when_needed(self):
    if not self.chart_initialized:
        self.initialize_chart()
```

### CPU 최적화

#### 1. **멀티스레딩**
```python
# 패킷 캡처와 처리를 별도 스레드에서 실행
capture_thread = threading.Thread(target=self._capture_packets)
processing_thread = threading.Thread(target=self._process_packets)
```

#### 2. **비동기 처리**
```python
# WebSocket 통신을 비동기로 처리
async def websocket_handler(websocket, path):
    async for message in websocket:
        await self.process_message(message)
```

## 🔧 배포 및 운영

### 개발 환경 설정

#### 1. **가상환경 구성**
```bash
# Python 가상환경 생성
python -m venv netmood_env
source netmood_env/bin/activate  # Linux/macOS
# netmood_env\Scripts\activate   # Windows

# 의존성 설치
pip install -r requirements.txt
```

#### 2. **환경 변수 설정**
```bash
# .env 파일
NETMOOD_DEBUG=True
NETMOOD_WEBSOCKET_PORT=8765
NETMOOD_PRIVACY_LEVEL=3
NETMOOD_ENCRYPTION_ENABLED=True
```

### 프로덕션 배포

#### 1. **Docker 컨테이너화**
```dockerfile
FROM python:3.9-slim

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    libpcap-dev \
    && rm -rf /var/lib/apt/lists/*

# Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 복사
COPY . /app
WORKDIR /app

# 실행
CMD ["python", "realtime_capture.py"]
```

#### 2. **서비스 등록**
```bash
# systemd 서비스 파일
[Unit]
Description=NetMood Real-time Analyzer
After=network.target

[Service]
Type=simple
User=netmood
ExecStart=/usr/bin/python3 /opt/netmood/realtime_capture.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## 📈 모니터링 및 로깅

### 로깅 전략

#### 1. **구조화된 로깅**
```python
import logging
import json

# JSON 형태의 구조화된 로그
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
```

#### 2. **로그 레벨별 분리**
```python
# 패킷 캡처 로그
packet_logger = logging.getLogger('packet_capture')
packet_logger.setLevel(logging.DEBUG)

# 보안 이벤트 로그
security_logger = logging.getLogger('security')
security_logger.setLevel(logging.WARNING)
```

### 성능 모니터링

#### 1. **메트릭 수집**
```python
class PerformanceMonitor:
    def __init__(self):
        self.metrics = {
            'packets_per_second': 0,
            'memory_usage': 0,
            'cpu_usage': 0,
            'active_connections': 0
        }
    
    def update_metrics(self):
        # 실시간 메트릭 업데이트
        pass
```

#### 2. **알림 시스템**
```python
def check_performance_thresholds(self):
    if self.metrics['packets_per_second'] > 10000:
        self.send_alert("High packet rate detected")
    
    if self.metrics['memory_usage'] > 80:
        self.send_alert("High memory usage")
```

## 🚀 확장성 고려사항

### 수평 확장

#### 1. **마이크로서비스 아키텍처**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Packet    │    │  Analysis   │    │  Dashboard  │
│  Capture    │    │   Service   │    │   Service   │
│  Service    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │   Message   │
                  │   Broker    │
                  │ (Redis/RMQ) │
                  └─────────────┘
```

#### 2. **로드 밸런싱**
```python
# 여러 캡처 서버 간 부하 분산
class LoadBalancer:
    def distribute_packets(self, packets):
        # 라운드 로빈 방식으로 패킷 분배
        server_id = self.current_server % len(self.servers)
        self.servers[server_id].process_packets(packets)
        self.current_server += 1
```

### 수직 확장

#### 1. **리소스 최적화**
```python
# CPU 코어 수에 따른 스레드 조정
import multiprocessing

def optimize_threading():
    cpu_count = multiprocessing.cpu_count()
    capture_threads = min(cpu_count // 2, 4)
    processing_threads = cpu_count - capture_threads
    return capture_threads, processing_threads
```

#### 2. **메모리 풀링**
```python
# 객체 재사용으로 GC 압력 감소
class PacketPool:
    def __init__(self, pool_size=1000):
        self.pool = [NetworkPacket() for _ in range(pool_size)]
        self.available = list(range(pool_size))
    
    def get_packet(self):
        if self.available:
            return self.pool[self.available.pop()]
        return NetworkPacket()
    
    def return_packet(self, packet):
        # 패킷 객체 초기화 및 풀에 반환
        pass
```

## 🔮 향후 개선 계획

### 기술적 개선

#### 1. **머신러닝 통합**
- **딥러닝 모델**: 더 정확한 감정 분석
- **실시간 학습**: 사용자 패턴 적응
- **앙상블 모델**: 여러 모델 결합

#### 2. **클라우드 통합**
- **Kubernetes**: 컨테이너 오케스트레이션
- **AWS/Azure**: 클라우드 서비스 연동
- **Edge Computing**: 엣지에서의 실시간 처리

#### 3. **고급 시각화**
- **3D 시각화**: 네트워크 토폴로지
- **AR/VR**: 몰입형 분석 환경
- **실시간 알림**: 모바일 푸시 알림

### 보안 강화

#### 1. **제로 트러스트 아키텍처**
- **다중 인증**: MFA 구현
- **마이크로 세분화**: 네트워크 분할
- **연속 검증**: 지속적 보안 모니터링

#### 2. **규정 준수**
- **ISO 27001**: 정보보안 관리
- **SOC 2**: 서비스 조직 통제
- **NIST**: 사이버보안 프레임워크

---

이 아키텍처를 통해 확장 가능하고 안전하며 사용자 친화적인 실시간 네트워크 감정 분석 시스템을 구축할 수 있습니다.
