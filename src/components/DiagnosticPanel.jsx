/**
 * NetMood Analyzer - 진단 패널 컴포넌트
 */

import React from 'react';
import { useDiagnostics } from '../hooks/useDiagnostics.js';
import { useNotification } from '../hooks/useNotification.js';
import './DiagnosticPanel.css';

/**
 * 진단 카드 컴포넌트
 */
function DiagnosticCard({ issue, onResolve, onRemove }) {
  const severityColors = {
    critical: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  };

  const severityLabels = {
    critical: '심각',
    warning: '주의',
    info: '정보',
  };

  return (
    <div className={`diagnostic-card diagnostic-card--${issue.severity}`}>
      <div className="diagnostic-header">
        <div className="diagnostic-icon">{issue.icon}</div>
        <div className="diagnostic-title-section">
          <h3 className="diagnostic-title">{issue.title}</h3>
          <span 
            className="diagnostic-severity"
            style={{ color: severityColors[issue.severity] }}
          >
            {severityLabels[issue.severity]}
          </span>
        </div>
      </div>

      <div className="diagnostic-content">
        <p className="diagnostic-description">{issue.description}</p>
        <div className="diagnostic-recommendation">
          <strong>권장사항:</strong> {issue.recommendation}
        </div>
      </div>

      <div className="diagnostic-actions">
        {!issue.resolved && (
          <button
            className="diagnostic-button diagnostic-button--resolve"
            onClick={() => onResolve(issue.id)}
          >
            해결됨
          </button>
        )}
        <button
          className="diagnostic-button diagnostic-button--remove"
          onClick={() => onRemove(issue.id)}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

/**
 * DiagnosticPanel 컴포넌트
 */
export default function DiagnosticPanel() {
  const { issues, isRunning, runDiagnostics, resolveIssue, removeIssue } = useDiagnostics();
  const { showInfo } = useNotification();

  const handleManualDiagnosis = () => {
    runDiagnostics();
    showInfo('진단이 실행되었습니다');
  };

  const activeIssues = issues.filter(issue => !issue.resolved);

  return (
    <div className="diagnostic-panel">
      <div className="diagnostic-panel-header">
        <h2 className="diagnostic-panel-title">네트워크 진단</h2>
        <button
          className="diagnostic-button diagnostic-button--primary"
          onClick={handleManualDiagnosis}
          disabled={isRunning}
        >
          {isRunning ? '진단 중...' : '수동 진단'}
        </button>
      </div>

      {activeIssues.length === 0 ? (
        <div className="diagnostic-empty">
          <div className="diagnostic-empty-icon">✅</div>
          <p className="diagnostic-empty-message">
            현재 네트워크 상태가 양호합니다.
          </p>
        </div>
      ) : (
        <div className="diagnostic-issues">
          {activeIssues.map(issue => (
            <DiagnosticCard
              key={issue.id}
              issue={issue}
              onResolve={resolveIssue}
              onRemove={removeIssue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

