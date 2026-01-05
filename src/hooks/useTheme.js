/**
 * NetMood Analyzer - 테마 훅
 */

import { useState, useEffect } from 'react';

/**
 * useTheme 훅
 */
export function useTheme() {
  // 시스템 설정 감지
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // localStorage에서 테마 가져오기
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('netmood-theme') || 'auto';
    } catch {
      return 'auto';
    }
  };

  const [theme, setTheme] = useState(() => {
    const stored = getStoredTheme();
    if (stored === 'auto') {
      return getSystemTheme();
    }
    return stored;
  });

  const [preference, setPreference] = useState(getStoredTheme);

  /**
   * 테마 적용
   */
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  /**
   * 시스템 테마 변경 감지
   */
  useEffect(() => {
    if (preference === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preference]);

  /**
   * 테마 설정
   */
  const setThemePreference = (newPreference) => {
    setPreference(newPreference);
    
    try {
      localStorage.setItem('netmood-theme', newPreference);
    } catch (error) {
      console.warn('테마 설정 저장 실패:', error);
    }

    if (newPreference === 'auto') {
      setTheme(getSystemTheme());
    } else {
      setTheme(newPreference);
    }
  };

  /**
   * 테마 토글
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemePreference(newTheme);
  };

  return {
    theme,
    preference,
    setTheme: setThemePreference,
    toggleTheme,
  };
}

