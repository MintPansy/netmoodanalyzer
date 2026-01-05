/**
 * NetMood Analyzer - 감정 계산 훅
 * 
 * useEmotionCalculator는 useEmotion 훅을 사용하는 것이 권장됩니다.
 * 이 파일은 하위 호환성을 위해 유지됩니다.
 */

import { useEmotion } from '../context/EmotionContext.jsx';

/**
 * useEmotionCalculator 훅 (하위 호환성)
 * @deprecated useEmotion 훅을 사용하세요
 */
export function useEmotionCalculator() {
  return useEmotion();
}

