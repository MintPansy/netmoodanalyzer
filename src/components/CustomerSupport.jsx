/**
 * NetMood Analyzer - 고객 지원 컴포넌트
 */

import React from 'react';
import './CustomerSupport.css';

/**
 * CustomerSupport 컴포넌트
 */
export default function CustomerSupport() {
  return (
    <div className="customer-support">
      <h3 className="customer-support-title">고객 지원</h3>
      <div className="customer-support-content">
        <p>문제가 지속되거나 도움이 필요하신가요?</p>
        <div className="customer-support-actions">
          <button className="support-button">문의하기</button>
          <button className="support-button">도움말</button>
        </div>
      </div>
    </div>
  );
}

