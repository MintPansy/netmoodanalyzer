/**
 * NetMood Analyzer - 네트워크 상태 Context
 */

import React, { createContext, useContext } from 'react';
import { useNetworkMetrics } from '../hooks/useNetworkMetrics.js';

const NetworkContext = createContext(null);

/**
 * NetworkProvider 컴포넌트
 */
export function NetworkProvider({ children }) {
  const networkMetrics = useNetworkMetrics();

  return (
    <NetworkContext.Provider value={networkMetrics}>
      {children}
    </NetworkContext.Provider>
  );
}

/**
 * useNetwork 훅 - Context에서 네트워크 상태 가져오기
 */
export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}

