/**
 * NetMood Analyzer - 설정 패널 컴포넌트
 */

import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { storageManager } from '../utils/storageManager.js';
import { exportToCSV, exportToJSON, generateFilename } from '../utils/exportManager.js';
import { useNotification } from '../hooks/useNotification.js';
import './SettingsPanel.css';

/**
 * SettingsPanel 컴포넌트
 */
export default function SettingsPanel() {
  const { history } = useNetwork();
  const { showSuccess, showError } = useNotification();
  const [isExporting, setIsExporting] = useState(false);

  /**
   * CSV 내보내기
   */
  const handleExportCSV = () => {
    try {
      setIsExporting(true);
      const filename = generateFilename('csv');
      exportToCSV(history, filename);
      showSuccess('CSV 파일이 다운로드되었습니다');
    } catch (error) {
      showError('내보내기 실패: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * JSON 내보내기
   */
  const handleExportJSON = () => {
    try {
      setIsExporting(true);
      const filename = generateFilename('json');
      exportToJSON(history, filename);
      showSuccess('JSON 파일이 다운로드되었습니다');
    } catch (error) {
      showError('내보내기 실패: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * 모든 데이터 삭제
   */
  const handleClearData = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        storageManager.clearAllData();
        showSuccess('모든 데이터가 삭제되었습니다');
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        showError('데이터 삭제 실패: ' + error.message);
      }
    }
  };

  return (
    <div className="settings-panel">
      <h2 className="settings-panel-title">설정</h2>

      <div className="settings-section">
        <h3 className="settings-section-title">데이터 관리</h3>
        
        <div className="settings-item">
          <div className="settings-item-label">
            <span>데이터 내보내기</span>
            <span className="settings-item-description">
              네트워크 데이터를 파일로 저장합니다
            </span>
          </div>
          <div className="settings-item-actions">
            <button
              className="settings-button settings-button--primary"
              onClick={handleExportCSV}
              disabled={isExporting || history.length === 0}
            >
              CSV 다운로드
            </button>
            <button
              className="settings-button settings-button--primary"
              onClick={handleExportJSON}
              disabled={isExporting || history.length === 0}
            >
              JSON 다운로드
            </button>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-label">
            <span>데이터 초기화</span>
            <span className="settings-item-description">
              모든 저장된 데이터를 삭제합니다
            </span>
          </div>
          <div className="settings-item-actions">
            <button
              className="settings-button settings-button--danger"
              onClick={handleClearData}
            >
              모든 데이터 삭제
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">앱 정보</h3>
        
        <div className="settings-item">
          <div className="settings-item-label">
            <span>버전</span>
            <span className="settings-item-description">
              NetMood Analyzer v1.0.0
            </span>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-label">
            <span>저장된 데이터</span>
            <span className="settings-item-description">
              {history.length}개의 데이터 포인트
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

