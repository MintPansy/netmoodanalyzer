/**
 * NetMood Analyzer - 감정 상태 Context
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useNetwork } from './NetworkContext.jsx';
import { calculateEmotions, getPrimaryEmotion } from '../utils/emotionCalculator.js';
import { EMOTIONS } from '../utils/constants.js';

const EmotionContext = createContext(null);

/**
 * EmotionProvider 컴포넌트
 */
export function EmotionProvider({ children }) {
  const { metrics, history } = useNetwork();

  // 현재 감정 점수 계산
  const currentEmotions = useMemo(() => {
    if (!metrics) {
      return {
        happy: 0,
        stress: 0,
        anger: 0,
        calm: 0,
        anxiety: 0,
      };
    }
    return calculateEmotions(metrics);
  }, [metrics]);

  // 주요 감정 결정
  const primaryEmotion = useMemo(() => {
    return getPrimaryEmotion(currentEmotions);
  }, [currentEmotions]);

  // 주요 감정 정보
  const primaryEmotionInfo = useMemo(() => {
    return EMOTIONS[primaryEmotion.toUpperCase()] || EMOTIONS.CALM;
  }, [primaryEmotion]);

  // 히스토리 감정 점수 계산
  const historyEmotions = useMemo(() => {
    return history.map(item => ({
      timestamp: item.timestamp,
      emotions: calculateEmotions(item),
      primary: getPrimaryEmotion(calculateEmotions(item)),
    }));
  }, [history]);

  const value = {
    currentEmotions,
    primaryEmotion,
    primaryEmotionInfo,
    historyEmotions,
  };

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
}

/**
 * useEmotion 훅 - Context에서 감정 상태 가져오기
 */
export function useEmotion() {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within EmotionProvider');
  }
  return context;
}

