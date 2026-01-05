/**
 * NetMood Analyzer - 5가지 감정 차트 컴포넌트
 * Chart.js를 사용하여 5가지 감정을 라인 차트로 표시합니다.
 */

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEmotion } from '../context/EmotionContext.jsx';
import { EMOTIONS } from '../utils/constants.js';
import './EmotionChart.css';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * EmotionChart 컴포넌트
 */
export default function EmotionChart() {
  const { historyEmotions } = useEmotion();

  const chartData = useMemo(() => {
    // 최근 60분 데이터만 사용 (최대 60개 포인트)
    const recentData = historyEmotions.slice(-60);
    
    if (recentData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = recentData.map((item, index) => {
      const date = new Date(item.timestamp);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    });

    return {
      labels,
      datasets: [
        {
          label: `${EMOTIONS.HAPPY.emoji} ${EMOTIONS.HAPPY.name}`,
          data: recentData.map(item => item.emotions.happy),
          borderColor: EMOTIONS.HAPPY.color,
          backgroundColor: `${EMOTIONS.HAPPY.color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: `${EMOTIONS.STRESS.emoji} ${EMOTIONS.STRESS.name}`,
          data: recentData.map(item => item.emotions.stress),
          borderColor: EMOTIONS.STRESS.color,
          backgroundColor: `${EMOTIONS.STRESS.color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: `${EMOTIONS.ANGER.emoji} ${EMOTIONS.ANGER.name}`,
          data: recentData.map(item => item.emotions.anger),
          borderColor: EMOTIONS.ANGER.color,
          backgroundColor: `${EMOTIONS.ANGER.color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: `${EMOTIONS.CALM.emoji} ${EMOTIONS.CALM.name}`,
          data: recentData.map(item => item.emotions.calm),
          borderColor: EMOTIONS.CALM.color,
          backgroundColor: `${EMOTIONS.CALM.color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
        {
          label: `${EMOTIONS.ANXIETY.emoji} ${EMOTIONS.ANXIETY.name}`,
          data: recentData.map(item => item.emotions.anxiety),
          borderColor: EMOTIONS.ANXIETY.color,
          backgroundColor: `${EMOTIONS.ANXIETY.color}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [historyEmotions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 12,
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
      title: {
        display: true,
        text: '5가지 감정 추이',
        font: {
          size: 16,
          weight: '600',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="emotion-chart-container">
      <div className="emotion-chart-wrapper">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="emotion-chart-empty">
            <p>데이터를 수집 중입니다...</p>
          </div>
        )}
      </div>
    </div>
  );
}

