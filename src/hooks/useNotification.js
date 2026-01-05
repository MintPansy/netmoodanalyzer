/**
 * NetMood Analyzer - 알림 훅
 * 
 * useNotification 훅은 NotificationContext를 사용하는 것이 권장됩니다.
 * 이 파일은 편의 메서드를 제공합니다.
 */

import { useCallback } from 'react';
import { useNotification as useNotificationContext } from '../context/NotificationContext.jsx';

/**
 * useNotification 훅
 * 편의 메서드를 제공합니다.
 */
export function useNotification() {
  const { addToast, removeToast, clearAll } = useNotificationContext();

  /**
   * 성공 토스트 표시
   */
  const showSuccess = useCallback((message, duration = 3000) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  /**
   * 에러 토스트 표시
   */
  const showError = useCallback((message, duration = 5000) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  /**
   * 경고 토스트 표시
   */
  const showWarning = useCallback((message, duration = 4000) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  /**
   * 정보 토스트 표시
   */
  const showInfo = useCallback((message, duration = 3000) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  /**
   * 토스트 표시 (일반)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    return addToast(message, type, duration);
  }, [addToast]);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll,
  };
}

