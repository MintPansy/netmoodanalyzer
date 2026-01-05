/**
 * NetMood Analyzer - 알림 상태 Context
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

/**
 * Toast 타입 정의
 * @typedef {Object} Toast
 * @property {string} id - 토스트 고유 ID
 * @property {string} message - 토스트 메시지
 * @property {'success'|'error'|'warning'|'info'} type - 토스트 타입
 * @property {number} duration - 표시 시간 (ms)
 * @property {number} timestamp - 생성 시간
 */

/**
 * NotificationProvider 컴포넌트
 */
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * 토스트 추가
   */
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    setToasts(prev => {
      // 중복 메시지 제거 (같은 메시지가 2초 이내에 있으면 무시)
      const recentToasts = prev.filter(
        t => Date.now() - t.timestamp < 2000 && t.message === message
      );
      if (recentToasts.length > 0) {
        return prev;
      }
      return [...prev, newToast];
    });

    // 자동 제거
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * 토스트 제거
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * 모든 토스트 제거
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * useNotification 훅 - Context에서 알림 상태 가져오기
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

