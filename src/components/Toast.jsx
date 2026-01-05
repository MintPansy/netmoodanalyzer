/**
 * NetMood Analyzer - Toast 알림 컴포넌트
 */

import React from 'react';
import { useNotification } from '../context/NotificationContext.jsx';
import './Toast.css';

/**
 * 개별 Toast 아이템 컴포넌트
 */
function ToastItem({ toast, onClose }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`toast toast--${toast.type}`}
      onClick={() => onClose(toast.id)}
    >
      <div className="toast-icon">{icons[toast.type] || icons.info}</div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={(e) => {
        e.stopPropagation();
        onClose(toast.id);
      }}>
        ×
      </button>
    </div>
  );
}

/**
 * Toast 컨테이너 컴포넌트
 */
export default function Toast() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

