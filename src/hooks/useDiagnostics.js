/**
 * NetMood Analyzer - 진단 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { useNetwork } from '../context/NetworkContext.jsx';
import { analyzeDiagnostics } from '../utils/diagnosticRules.js';

/**
 * useDiagnostics 훅
 */
export function useDiagnostics() {
  const { metrics } = useNetwork();
  const [issues, setIssues] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  /**
   * 진단 실행
   */
  const runDiagnostics = useCallback((metricsToAnalyze = metrics) => {
    if (!metricsToAnalyze) {
      setIssues([]);
      return [];
    }

    setIsRunning(true);
    const newIssues = analyzeDiagnostics(metricsToAnalyze);
    setIssues(newIssues);
    setIsRunning(false);

    return newIssues;
  }, [metrics]);

  /**
   * 이슈 해결 처리
   */
  const resolveIssue = useCallback((issueId) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, resolved: true }
        : issue
    ));
  }, []);

  /**
   * 모든 이슈 해결 처리
   */
  const resolveAllIssues = useCallback(() => {
    setIssues(prev => prev.map(issue => ({ ...issue, resolved: true })));
  }, []);

  /**
   * 이슈 제거
   */
  const removeIssue = useCallback((issueId) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));
  }, []);

  /**
   * 모든 이슈 제거
   */
  const clearAllIssues = useCallback(() => {
    setIssues([]);
  }, []);

  // 메트릭 변경 시 자동 진단
  useEffect(() => {
    if (metrics) {
      runDiagnostics(metrics);
    }
  }, [metrics, runDiagnostics]);

  return {
    issues,
    isRunning,
    runDiagnostics,
    resolveIssue,
    resolveAllIssues,
    removeIssue,
    clearAllIssues,
  };
}

