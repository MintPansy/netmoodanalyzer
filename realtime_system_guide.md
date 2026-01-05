# 🔴 NetMood 실시간 네트워크 분석 시스템 - 완전 가이드

## 📋 개요

NetMood Analyzer의 실시간 네트워크 트래픽 캡처 및 AI 감정 분석 시스템입니다. 사용자의 로컬 PC에서 네트워크 패킷을 실시간으로 캡처하고, 이를 감정 상태로 분석하여 직관적인 시각화를 제공합니다.

## 🎯 주요 기능

### 1. **실시간 패킷 캡처**
- **크로스 플랫폼 지원**: Windows, macOS, Linux
- **다중 캡처 방법**: Scapy, psutil, pcapy
- **자동 폴백**: 라이브러리 없을 시 시뮬레이션 모드
- **고성능 처리**: 멀티스레딩 기반 비동기 처리

### 2. **AI 감정 분석**
- **5가지 감정**: 평온, 기쁨, 불안, 화남, 슬픔
- **실시간 분석**: 패킷 10개마다 감정 상태 업데이트
- **규칙 기반**: 엔트로피, 패킷 크기, 전송률 기반 분석
- **확장 가능**: 머신러닝 모델 통합 준비

### 3. **보안 및 개인정보 보호**
- **IP 익명화**: 5단계 익명화 레벨
- **데이터 암호화**: AES-256 암호화
- **자동 정리**: 분류별 데이터 보존 기간 설정
- **GDPR 준수**: 개인정보 보호 규정 준수

### 4. **실시간 시각화**
- **WebSocket 통신**: 실시간 데이터 스트리밍
- **인터랙티브 차트**: Chart.js 기반 고급 시각화
- **B2C 친화적 UI**: 직관적인 이모지와 색상
- **모바일 최적화**: 반응형 디자인

## 🚀 빠른 시작

### 1. **시스템 요구사항**

#### **Windows**
```bash
# Npcap 설치 (WinPcap 대체)
# https://npcap.com/ 에서 다운로드

# 관리자 권한으로 PowerShell 실행 필요
```

#### **macOS**
```bash
# Homebrew 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# libpcap 설치
brew install libpcap
```

#### **Linux (Ubuntu/Debian)**
```bash
# 시스템 패키지 업데이트
sudo apt-get update

# 필수 라이브러리 설치
sudo apt-get install libpcap-dev python3-dev
```

### 2. **설치 및 설정**

```bash
# 1. 프로젝트 클론 또는 다운로드
git clone <repository-url>
cd netmood-analyzer

# 2. Python 가상환경 생성
python -m venv netmood_env

# 3. 가상환경 활성화
# Windows
netmood_env\Scripts\activate
# macOS/Linux
source netmood_env/bin/activate

# 4. 의존성 설치
pip install -r requirements.txt

# 5. 기본 설정 파일 생성
python run_realtime_system.py --create-config
```

### 3. **시스템 실행**

```bash
# 기본 실행 (모든 서비스 시작)
python run_realtime_system.py

# 웹 서버 없이 실행 (웹소켓만)
python run_realtime_system.py --no-web

# 웹소켓 서버 없이 실행 (웹만)
python run_realtime_system.py --no-websocket

# 디버그 모드
python run_realtime_system.py --debug

# 사용자 정의 포트
python run_realtime_system.py --websocket-port 8766 --web-port 5001
```

### 4. **웹 대시보드 접속**

시스템이 시작되면 다음 URL로 접속:

- **실시간 대시보드**: http://localhost:5000
- **웹소켓 연결**: ws://localhost:8765

## 🔧 고급 설정

### 1. **설정 파일 수정**

`netmood_config.json` 파일을 편집하여 시스템 동작을 사용자 정의:

```json
{
  "log_level": "INFO",
  "enable_encryption": true,
  "anonymize_ips": true,
  "data_anonymization_level": 3,
  "websocket_host": "localhost",
  "websocket_port": 8765,
  "web_host": "0.0.0.0",
  "web_port": 5000,
  "session_timeout_minutes": 30,
  "trusted_networks": ["192.168.0.0/16", "10.0.0.0/8"]
}
```

### 2. **보안 설정**

#### **개인정보 보호 레벨**
- **레벨 1**: 익명화 없음
- **레벨 2**: 마지막 옥텟 익명화
- **레벨 3**: 해시 기반 익명화 (기본값)
- **레벨 4**: 서브넷 마스킹
- **레벨 5**: 완전 익명화

#### **데이터 분류 및 보존**
- **PUBLIC**: 30일 보존
- **INTERNAL**: 7일 보존
- **CONFIDENTIAL**: 1일 보존
- **RESTRICTED**: 즉시 삭제

### 3. **네트워크 인터페이스 설정**

```python
# 특정 인터페이스에서만 캡처
def get_network_interfaces():
    import psutil
    interfaces = psutil.net_if_addrs()
    for interface, addrs in interfaces.items():
        print(f"Interface: {interface}")
        for addr in addrs:
            print(f"  {addr.family.name}: {addr.address}")
```

## 📊 사용법

### 1. **실시간 모니터링**

#### **웹 대시보드에서:**
1. **"▶️ 모니터링 시작"** 버튼 클릭
2. 실시간 감정 상태 확인
3. 패킷 스트림 모니터링
4. 감정 분포 차트 관찰

#### **명령행에서:**
```bash
# 시스템 상태 확인
curl http://localhost:5000/api/status

# 보안 보고서 조회
curl http://localhost:5000/api/security-report

# 데이터 내보내기
curl -X POST http://localhost:5000/api/export-data
```

### 2. **데이터 내보내기**

```python
# CSV 형식으로 내보내기
filename = system.export_current_data()
print(f"데이터가 저장되었습니다: {filename}")
```

### 3. **API 활용**

```python
import requests
import json

# 시스템 상태 조회
response = requests.get('http://localhost:5000/api/status')
status = response.json()

# 모니터링 시작
requests.post('http://localhost:5000/api/start-monitoring')

# 모니터링 중지
requests.post('http://localhost:5000/api/stop-monitoring')
```

## 🔒 보안 고려사항

### 1. **권한 요구사항**

#### **Windows**
- 관리자 권한 필요 (패킷 캡처)
- Windows Defender 예외 설정
- 방화벽 포트 허용

#### **macOS**
- 네트워크 접근 권한 허용
- 방화벽 설정 조정
- 개발자 도구 설치

#### **Linux**
- CAP_NET_RAW 권한 필요
- sudo 권한 또는 특별한 권한 설정
- SELinux/AppArmor 정책 조정

### 2. **개인정보 보호**

#### **자동 익명화**
- IP 주소 해시 처리
- MAC 주소 마스킹
- 개인 식별 정보 필터링

#### **데이터 최소화**
- 필요한 정보만 수집
- 자동 데이터 정리
- 사용자 동의 기반 처리

### 3. **암호화**

#### **전송 중 암호화**
- WebSocket over TLS
- HTTPS 통신
- API 인증 토큰

#### **저장 시 암호화**
- AES-256 암호화
- PBKDF2 키 파생
- Fernet 토큰 기반 암호화

## 🐛 문제 해결

### 1. **일반적인 문제**

#### **패킷 캡처 실패**
```bash
# 권한 확인
sudo python run_realtime_system.py

# 네트워크 인터페이스 확인
python -c "import psutil; print(psutil.net_if_addrs())"

# 방화벽 설정 확인
sudo ufw status  # Ubuntu
```

#### **웹소켓 연결 실패**
```bash
# 포트 사용 중인지 확인
netstat -an | grep 8765
lsof -i :8765

# 다른 포트 사용
python run_realtime_system.py --websocket-port 8766
```

#### **의존성 설치 실패**
```bash
# pip 업그레이드
pip install --upgrade pip

# 개별 패키지 설치
pip install scapy --no-cache-dir
pip install websockets --no-cache-dir
```

### 2. **로그 분석**

```bash
# 시스템 로그 확인
tail -f netmood_system.log

# 패킷 캡처 로그 확인
tail -f packet_capture.log

# 디버그 모드로 실행
python run_realtime_system.py --debug
```

### 3. **성능 최적화**

#### **메모리 사용량 감소**
```python
# 설정에서 큐 크기 조정
config = {
    "max_packet_queue_size": 500,  # 기본값: 1000
    "max_recent_packets": 50,      # 기본값: 100
}
```

#### **CPU 사용량 최적화**
```python
# 캡처 주기 조정
config = {
    "capture_interval": 0.1,  # 0.1초마다 캡처
    "analysis_interval": 10,  # 10개 패킷마다 분석
}
```

## 📈 확장 및 커스터마이징

### 1. **새로운 감정 추가**

```python
# emotion_config.py
EMOTION_CONFIG = {
    '평온': {'emoji': '😌', 'color': '#28a745'},
    '기쁨': {'emoji': '😊', 'color': '#17a2b8'},
    '불안': {'emoji': '😰', 'color': '#ffc107'},
    '화남': {'emoji': '😡', 'color': '#dc3545'},
    '슬픔': {'emoji': '😢', 'color': '#6f42c1'},
    '새로운감정': {'emoji': '🤔', 'color': '#6c757d'}  # 새로 추가
}
```

### 2. **머신러닝 모델 통합**

```python
# ml_analyzer.py
import tensorflow as tf

class MLNetMoodAnalyzer:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
    
    def analyze_packet(self, packet_features):
        prediction = self.model.predict(packet_features)
        return self._convert_to_emotion(prediction)
```

### 3. **클라우드 연동**

```python
# cloud_integration.py
import boto3

class CloudDataExporter:
    def __init__(self, bucket_name):
        self.s3 = boto3.client('s3')
        self.bucket = bucket_name
    
    def upload_analysis_data(self, data, filename):
        self.s3.put_object(
            Bucket=self.bucket,
            Key=f'netmood-analysis/{filename}',
            Body=json.dumps(data)
        )
```

## 📚 API 참조

### 1. **REST API 엔드포인트**

| 엔드포인트 | 방법 | 설명 |
|-----------|------|------|
| `/api/status` | GET | 시스템 상태 조회 |
| `/api/security-report` | GET | 보안 보고서 조회 |
| `/api/export-data` | GET | 데이터 내보내기 |
| `/api/start-monitoring` | POST | 모니터링 시작 |
| `/api/stop-monitoring` | POST | 모니터링 중지 |

### 2. **WebSocket 메시지**

```javascript
// 연결
const ws = new WebSocket('ws://localhost:8765');

// 메시지 수신
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'analysis_update') {
        updateDashboard(data.data);
    }
};

// 메시지 전송
ws.send(JSON.stringify({
    type: 'start_monitoring',
    settings: { anonymize_ips: true }
}));
```

## 🔮 향후 개발 계획

### 1. **단기 계획 (1-3개월)**
- 머신러닝 모델 통합
- 모바일 앱 개발
- 고급 시각화 기능
- 클라우드 동기화

### 2. **중기 계획 (3-6개월)**
- 엣지 컴퓨팅 지원
- 다중 네트워크 모니터링
- 실시간 알림 시스템
- API 마켓플레이스

### 3. **장기 계획 (6-12개월)**
- AI 기반 위협 탐지
- 네트워크 토폴로지 시각화
- 자동화된 대응 시스템
- 엔터프라이즈 버전

---

이 가이드를 통해 NetMood 실시간 네트워크 분석 시스템을 성공적으로 구축하고 운영할 수 있습니다. 추가 질문이나 지원이 필요하시면 언제든 문의해 주세요!
