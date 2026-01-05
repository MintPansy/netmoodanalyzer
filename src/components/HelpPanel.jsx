/**
 * NetMood Analyzer - 도움말 패널 컴포넌트
 */

import React, { useState } from 'react';
import { EMOTIONS } from '../utils/constants.js';
import './HelpPanel.css';

const FAQ_ITEMS = [
  {
    question: '5가지 감정은 무엇을 의미하나요?',
    answer: '네트워크 상태를 5가지 감정으로 표현합니다. 😊 기쁨: 최적 상태, 😰 스트레스: 높은 지연시간, 😠 화남: 불안정한 연결, 😌 평온: 안정적 상태, 😟 불안: 느린 속도',
  },
  {
    question: '데이터는 어디에 저장되나요?',
    answer: '모든 데이터는 브라우저의 localStorage에 저장됩니다. 서버로 전송되지 않으며, 완전히 로컬에서 관리됩니다.',
  },
  {
    question: '진단 기능은 어떻게 작동하나요?',
    answer: '네트워크 메트릭을 분석하여 문제를 자동으로 감지합니다. 지연시간, 속도, 패킷 손실 등을 확인하고 권장사항을 제시합니다.',
  },
  {
    question: '데이터를 내보낼 수 있나요?',
    answer: '네, 설정 패널에서 CSV 또는 JSON 형식으로 데이터를 내보낼 수 있습니다. 모든 네트워크 메트릭과 감정 점수가 포함됩니다.',
  },
];

/**
 * HelpPanel 컴포넌트
 */
export default function HelpPanel() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="help-panel">
      <h2 className="help-panel-title">도움말</h2>

      <div className="help-section">
        <h3 className="help-section-title">5가지 감정 설명</h3>
        <div className="emotion-guide">
          {Object.values(EMOTIONS).map((emotion, index) => (
            <div key={index} className="emotion-guide-item">
              <span className="emotion-guide-emoji">{emotion.emoji}</span>
              <div className="emotion-guide-content">
                <strong>{emotion.name}</strong>
                <p>{emotion.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="help-section">
        <h3 className="help-section-title">자주 묻는 질문</h3>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openFAQ === index ? '−' : '+'}</span>
              </button>
              {openFAQ === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="help-section">
        <h3 className="help-section-title">키보드 단축키</h3>
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>K</kbd>
            <span>설정 열기</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>E</kbd>
            <span>데이터 내보내기</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>D</kbd>
            <span>진단 실행</span>
          </div>
        </div>
      </div>
    </div>
  );
}

