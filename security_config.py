#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NetMood Analyzer - 보안 및 개인정보 보호 설정
데이터 암호화, 접근 제어, 개인정보 보호 정책을 관리하는 모듈
"""

import hashlib
import hmac
import secrets
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import logging
import os
from pathlib import Path

# 암호화 라이브러리
try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    CRYPTO_AVAILABLE = True
except ImportError:
    CRYPTO_AVAILABLE = False

@dataclass
class SecuritySettings:
    """보안 설정"""
    enable_encryption: bool = True
    encryption_key: Optional[str] = None
    session_timeout_minutes: int = 30
    max_login_attempts: int = 5
    enable_audit_log: bool = True
    data_retention_days: int = 7
    allow_remote_access: bool = False
    trusted_networks: List[str] = None

@dataclass
class PrivacySettings:
    """개인정보 보호 설정"""
    anonymize_ips: bool = True
    anonymize_macs: bool = True
    filter_personal_data: bool = True
    local_processing_only: bool = True
    auto_data_cleanup: bool = True
    data_anonymization_level: int = 3  # 1-5 (높을수록 강한 익명화)
    consent_required: bool = True
    gdpr_compliant: bool = True

@dataclass
class DataClassification:
    """데이터 분류 레벨"""
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"

class EncryptionManager:
    """데이터 암호화 관리자"""
    
    def __init__(self, master_key: str = None):
        self.master_key = master_key or self._generate_master_key()
        self.fernet = self._create_fernet_instance()
        
    def _generate_master_key(self) -> str:
        """마스터 키 생성"""
        return secrets.token_urlsafe(32)
    
    def _create_fernet_instance(self) -> Optional[Fernet]:
        """Fernet 암호화 인스턴스 생성"""
        if not CRYPTO_AVAILABLE:
            logging.warning("Cryptography library not available. Encryption disabled.")
            return None
            
        try:
            # PBKDF2를 사용하여 키 파생
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'netmood_salt_2024',
                iterations=100000,
            )
            key = kdf.derive(self.master_key.encode())
            return Fernet(key)
        except Exception as e:
            logging.error(f"Failed to create Fernet instance: {e}")
            return None
    
    def encrypt_data(self, data: str) -> str:
        """데이터 암호화"""
        if not self.fernet:
            return data
            
        try:
            encrypted_data = self.fernet.encrypt(data.encode())
            return encrypted_data.hex()
        except Exception as e:
            logging.error(f"Encryption failed: {e}")
            return data
    
    def decrypt_data(self, encrypted_data: str) -> str:
        """데이터 복호화"""
        if not self.fernet:
            return encrypted_data
            
        try:
            encrypted_bytes = bytes.fromhex(encrypted_data)
            decrypted_data = self.fernet.decrypt(encrypted_bytes)
            return decrypted_data.decode()
        except Exception as e:
            logging.error(f"Decryption failed: {e}")
            return encrypted_data

class DataAnonymizer:
    """데이터 익명화 처리기"""
    
    def __init__(self, privacy_settings: PrivacySettings):
        self.settings = privacy_settings
        self.hash_salt = secrets.token_urlsafe(16)
    
    def anonymize_ip(self, ip: str) -> str:
        """IP 주소 익명화"""
        if not self.settings.anonymize_ips:
            return ip
        
        level = self.settings.data_anonymization_level
        
        if level >= 5:
            # 완전 익명화 - 모든 IP를 로컬호스트로
            return "127.0.0.1"
        elif level >= 4:
            # 서브넷 마스킹 - 마지막 2 옥텟 익명화
            if '.' in ip:
                parts = ip.split('.')
                return f"{parts[0]}.{parts[1]}.xxx.xxx"
        elif level >= 3:
            # 해시 기반 익명화
            hash_obj = hashlib.sha256(f"{ip}{self.hash_salt}".encode())
            return f"192.168.{int(hash_obj.hexdigest()[:2], 16)}.{int(hash_obj.hexdigest()[2:4], 16)}"
        elif level >= 2:
            # 마지막 옥텟 익명화
            if '.' in ip:
                parts = ip.split('.')
                parts[3] = "xxx"
                return '.'.join(parts)
        else:
            # 레벨 1 - 익명화 없음
            return ip
        
        return ip
    
    def anonymize_mac(self, mac: str) -> str:
        """MAC 주소 익명화"""
        if not self.settings.anonymize_macs:
            return mac
        
        # MAC 주소의 마지막 3 바이트를 익명화
        if ':' in mac:
            parts = mac.split(':')
            parts[3:] = ['xx', 'xx', 'xx']
            return ':'.join(parts)
        
        return mac
    
    def filter_personal_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """개인정보 필터링"""
        if not self.settings.filter_personal_data:
            return data
        
        # 민감한 필드 목록
        sensitive_fields = [
            'username', 'user_id', 'email', 'phone', 'name',
            'credit_card', 'ssn', 'passport', 'license'
        ]
        
        filtered_data = data.copy()
        
        for field in sensitive_fields:
            if field in filtered_data:
                filtered_data[field] = "[FILTERED]"
        
        return filtered_data
    
    def should_retain_data(self, timestamp: str, classification: str) -> bool:
        """데이터 보존 여부 결정"""
        if not self.settings.auto_data_cleanup:
            return True
        
        # 분류별 보존 기간
        retention_periods = {
            DataClassification.PUBLIC: 30,      # 30일
            DataClassification.INTERNAL: 7,     # 7일
            DataClassification.CONFIDENTIAL: 1, # 1일
            DataClassification.RESTRICTED: 0    # 즉시 삭제
        }
        
        retention_days = retention_periods.get(classification, 7)
        
        try:
            data_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            cutoff_time = datetime.now() - timedelta(days=retention_days)
            return data_time > cutoff_time
        except:
            return False

class AccessController:
    """접근 제어 관리자"""
    
    def __init__(self, security_settings: SecuritySettings):
        self.settings = security_settings
        self.active_sessions: Dict[str, Dict] = {}
        self.login_attempts: Dict[str, List[float]] = {}
        self.audit_log: List[Dict] = []
        
        # 신뢰할 수 있는 네트워크
        self.trusted_networks = set(security_settings.trusted_networks or [])
    
    def authenticate_user(self, username: str, password: str, client_ip: str) -> bool:
        """사용자 인증"""
        # 로그인 시도 제한
        if not self._check_login_attempts(username):
            self._log_access_attempt(username, client_ip, "BLOCKED_TOO_MANY_ATTEMPTS")
            return False
        
        # 신뢰할 수 있는 네트워크 확인
        if not self._is_trusted_network(client_ip):
            self._log_access_attempt(username, client_ip, "BLOCKED_UNTRUSTED_NETWORK")
            return False
        
        # 간단한 인증 (실제 환경에서는 강력한 인증 시스템 사용)
        if self._validate_credentials(username, password):
            self._create_session(username, client_ip)
            self._log_access_attempt(username, client_ip, "SUCCESS")
            return True
        else:
            self._log_access_attempt(username, client_ip, "FAILED")
            return False
    
    def _check_login_attempts(self, username: str) -> bool:
        """로그인 시도 횟수 확인"""
        now = time.time()
        attempts = self.login_attempts.get(username, [])
        
        # 1시간 이내의 시도만 계산
        recent_attempts = [attempt for attempt in attempts if now - attempt < 3600]
        self.login_attempts[username] = recent_attempts
        
        return len(recent_attempts) < self.settings.max_login_attempts
    
    def _is_trusted_network(self, client_ip: str) -> bool:
        """신뢰할 수 있는 네트워크 확인"""
        if not self.settings.allow_remote_access:
            # 로컬 네트워크만 허용
            return client_ip.startswith('127.') or client_ip.startswith('192.168.') or client_ip.startswith('10.')
        
        # 신뢰할 수 있는 네트워크 목록 확인
        for network in self.trusted_networks:
            if self._ip_in_network(client_ip, network):
                return True
        
        return False
    
    def _ip_in_network(self, ip: str, network: str) -> bool:
        """IP가 네트워크에 속하는지 확인"""
        try:
            import ipaddress
            return ipaddress.ip_address(ip) in ipaddress.ip_network(network)
        except:
            return False
    
    def _validate_credentials(self, username: str, password: str) -> bool:
        """자격 증명 검증 (예시 구현)"""
        # 실제 환경에서는 해시된 비밀번호와 데이터베이스 사용
        valid_users = {
            'admin': 'admin123',
            'user': 'user123',
            'demo': 'demo123'
        }
        
        return valid_users.get(username) == password
    
    def _create_session(self, username: str, client_ip: str):
        """사용자 세션 생성"""
        session_id = secrets.token_urlsafe(32)
        session_data = {
            'username': username,
            'client_ip': client_ip,
            'created_at': time.time(),
            'last_activity': time.time()
        }
        
        self.active_sessions[session_id] = session_data
        return session_id
    
    def validate_session(self, session_id: str) -> bool:
        """세션 유효성 검증"""
        if session_id not in self.active_sessions:
            return False
        
        session = self.active_sessions[session_id]
        now = time.time()
        
        # 세션 타임아웃 확인
        if now - session['last_activity'] > self.settings.session_timeout_minutes * 60:
            del self.active_sessions[session_id]
            return False
        
        # 마지막 활동 시간 업데이트
        session['last_activity'] = now
        return True
    
    def _log_access_attempt(self, username: str, client_ip: str, result: str):
        """접근 시도 로그 기록"""
        if not self.settings.enable_audit_log:
            return
        
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'username': username,
            'client_ip': client_ip,
            'result': result,
            'user_agent': 'NetMood-Analyzer'
        }
        
        self.audit_log.append(log_entry)
        
        # 로그 크기 제한 (최근 1000개 항목만 유지)
        if len(self.audit_log) > 1000:
            self.audit_log = self.audit_log[-1000:]
    
    def get_audit_log(self, limit: int = 100) -> List[Dict]:
        """감사 로그 조회"""
        return self.audit_log[-limit:]
    
    def cleanup_expired_sessions(self):
        """만료된 세션 정리"""
        now = time.time()
        expired_sessions = [
            session_id for session_id, session in self.active_sessions.items()
            if now - session['last_activity'] > self.settings.session_timeout_minutes * 60
        ]
        
        for session_id in expired_sessions:
            del self.active_sessions[session_id]

class SecurityManager:
    """통합 보안 관리자"""
    
    def __init__(self, 
                 security_settings: SecuritySettings = None,
                 privacy_settings: PrivacySettings = None):
        self.security_settings = security_settings or SecuritySettings()
        self.privacy_settings = privacy_settings or PrivacySettings()
        
        self.encryption_manager = EncryptionManager()
        self.data_anonymizer = DataAnonymizer(self.privacy_settings)
        self.access_controller = AccessController(self.security_settings)
        
        # 보안 정책 로드
        self._load_security_policies()
        
        logging.info("Security Manager initialized")
    
    def _load_security_policies(self):
        """보안 정책 로드"""
        config_dir = Path.home() / '.netmood'
        config_dir.mkdir(exist_ok=True)
        
        policy_file = config_dir / 'security_policies.json'
        
        if policy_file.exists():
            try:
                with open(policy_file, 'r') as f:
                    policies = json.load(f)
                    
                # 정책 적용
                if 'blocked_ips' in policies:
                    self.access_controller.blocked_ips = set(policies['blocked_ips'])
                    
                if 'allowed_users' in policies:
                    self.access_controller.allowed_users = set(policies['allowed_users'])
                    
            except Exception as e:
                logging.error(f"Failed to load security policies: {e}")
    
    def save_security_policies(self):
        """보안 정책 저장"""
        config_dir = Path.home() / '.netmood'
        config_dir.mkdir(exist_ok=True)
        
        policy_file = config_dir / 'security_policies.json'
        
        policies = {
            'blocked_ips': list(getattr(self.access_controller, 'blocked_ips', [])),
            'allowed_users': list(getattr(self.access_controller, 'allowed_users', [])),
            'last_updated': datetime.now().isoformat()
        }
        
        try:
            with open(policy_file, 'w') as f:
                json.dump(policies, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to save security policies: {e}")
    
    def process_network_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """네트워크 데이터 보안 처리"""
        # 개인정보 필터링
        filtered_data = self.data_anonymizer.filter_personal_data(data)
        
        # IP 주소 익명화
        if 'source_ip' in filtered_data:
            filtered_data['source_ip'] = self.data_anonymizer.anonymize_ip(filtered_data['source_ip'])
        
        if 'destination_ip' in filtered_data:
            filtered_data['destination_ip'] = self.data_anonymizer.anonymize_ip(filtered_data['destination_ip'])
        
        # 데이터 분류
        filtered_data['data_classification'] = self._classify_data(filtered_data)
        
        # 보존 기간 확인
        if not self.data_anonymizer.should_retain_data(
            filtered_data.get('timestamp', ''), 
            filtered_data['data_classification']
        ):
            return None  # 데이터 삭제
        
        return filtered_data
    
    def _classify_data(self, data: Dict[str, Any]) -> str:
        """데이터 분류"""
        # 민감한 패턴 감지
        sensitive_patterns = [
            'password', 'token', 'key', 'secret', 'auth',
            'credit', 'ssn', 'personal', 'private'
        ]
        
        data_str = str(data).lower()
        
        for pattern in sensitive_patterns:
            if pattern in data_str:
                return DataClassification.RESTRICTED
        
        # 외부 네트워크 통신은 CONFIDENTIAL
        if data.get('destination_ip', '').startswith(('8.8.', '1.1.', '208.67.')):
            return DataClassification.CONFIDENTIAL
        
        # 내부 네트워크는 INTERNAL
        if data.get('source_ip', '').startswith(('192.168.', '10.', '172.')):
            return DataClassification.INTERNAL
        
        return DataClassification.PUBLIC
    
    def encrypt_sensitive_data(self, data: str) -> str:
        """민감한 데이터 암호화"""
        return self.encryption_manager.encrypt_data(data)
    
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        """암호화된 데이터 복호화"""
        return self.encryption_manager.decrypt_data(encrypted_data)
    
    def authenticate_request(self, username: str, password: str, client_ip: str) -> Optional[str]:
        """요청 인증"""
        return self.access_controller.authenticate_user(username, password, client_ip)
    
    def validate_session(self, session_id: str) -> bool:
        """세션 검증"""
        return self.access_controller.validate_session(session_id)
    
    def get_security_report(self) -> Dict[str, Any]:
        """보안 보고서 생성"""
        return {
            'active_sessions': len(self.access_controller.active_sessions),
            'failed_attempts_24h': len([
                log for log in self.access_controller.audit_log
                if log['result'] == 'FAILED' and 
                datetime.now() - datetime.fromisoformat(log['timestamp']) < timedelta(hours=24)
            ]),
            'trusted_networks': len(self.access_controller.trusted_networks),
            'encryption_enabled': self.encryption_manager.fernet is not None,
            'privacy_level': self.privacy_settings.data_anonymization_level,
            'data_retention_days': self.privacy_settings.data_retention_days,
            'last_audit_log': self.access_controller.audit_log[-5:] if self.access_controller.audit_log else []
        }

def main():
    """보안 설정 테스트"""
    # 보안 설정
    security_settings = SecuritySettings(
        enable_encryption=True,
        session_timeout_minutes=30,
        max_login_attempts=5,
        enable_audit_log=True,
        allow_remote_access=False,
        trusted_networks=['192.168.0.0/16', '10.0.0.0/8']
    )
    
    # 개인정보 보호 설정
    privacy_settings = PrivacySettings(
        anonymize_ips=True,
        anonymize_macs=True,
        filter_personal_data=True,
        local_processing_only=True,
        auto_data_cleanup=True,
        data_anonymization_level=3
    )
    
    # 보안 관리자 초기화
    security_manager = SecurityManager(security_settings, privacy_settings)
    
    # 테스트 데이터
    test_data = {
        'timestamp': datetime.now().isoformat(),
        'source_ip': '192.168.1.100',
        'destination_ip': '8.8.8.8',
        'protocol': 'TCP',
        'bytes': 1024,
        'username': 'test_user',
        'email': 'test@example.com'
    }
    
    # 데이터 처리 테스트
    processed_data = security_manager.process_network_data(test_data)
    print("Processed data:", processed_data)
    
    # 암호화 테스트
    sensitive_text = "sensitive_information"
    encrypted = security_manager.encrypt_sensitive_data(sensitive_text)
    decrypted = security_manager.decrypt_sensitive_data(encrypted)
    print(f"Encryption test: {sensitive_text} -> {encrypted} -> {decrypted}")
    
    # 보안 보고서
    report = security_manager.get_security_report()
    print("Security report:", json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
