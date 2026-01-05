/**
 * NetMood Analyzer - 데이터 내보내기 관리
 */

/**
 * CSV 형식으로 내보내기
 * @param {Array} data - 내보낼 데이터 배열
 * @param {string} filename - 파일명
 * @param {Object} options - 옵션
 */
export function exportToCSV(data, filename = 'netmood-data.csv', options = {}) {
  if (!data || data.length === 0) {
    throw new Error('내보낼 데이터가 없습니다');
  }

  const {
    startDate,
    endDate,
    columns = null,
  } = options;

  // 날짜 필터링
  let filteredData = data;
  if (startDate || endDate) {
    filteredData = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;
      return true;
    });
  }

  // CSV 헤더 정의
  const defaultColumns = [
    'timestamp',
    'latency',
    'downloadSpeed',
    'uploadSpeed',
    'packetLoss',
    'jitter',
    'signalStrength',
    'connectionType',
    'isConnected',
    'connectionDropCount',
    'happy',
    'stress',
    'anger',
    'calm',
    'anxiety',
  ];

  const selectedColumns = columns || defaultColumns;

  // CSV 헤더 생성
  const headers = selectedColumns.map(col => {
    const labels = {
      timestamp: '시간',
      latency: '지연시간 (ms)',
      downloadSpeed: '다운로드 속도 (Mbps)',
      uploadSpeed: '업로드 속도 (Mbps)',
      packetLoss: '패킷 손실 (%)',
      jitter: '지터 (ms)',
      signalStrength: '신호 강도 (dBm)',
      connectionType: '연결 타입',
      isConnected: '연결 상태',
      connectionDropCount: '연결 끊김 횟수',
      happy: '기쁨',
      stress: '스트레스',
      anger: '화남',
      calm: '평온',
      anxiety: '불안',
    };
    return labels[col] || col;
  });

  // CSV 데이터 행 생성
  const rows = filteredData.map(item => {
    return selectedColumns.map(col => {
      let value = item[col];
      
      // 특수 처리
      if (col === 'timestamp') {
        value = new Date(value).toISOString();
      } else if (value === null || value === undefined) {
        value = '';
      } else if (typeof value === 'boolean') {
        value = value ? '예' : '아니오';
      } else if (typeof value === 'object' && col === 'emotions') {
        // emotions 객체 처리
        value = `${item.emotions?.happy || 0},${item.emotions?.stress || 0},${item.emotions?.anger || 0},${item.emotions?.calm || 0},${item.emotions?.anxiety || 0}`;
      } else {
        value = String(value);
      }
      
      // CSV 이스케이프 (쉼표, 따옴표 처리)
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    });
  });

  // CSV 문자열 생성
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // BOM 추가 (한글 깨짐 방지)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 다운로드
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * JSON 형식으로 내보내기
 * @param {Array} data - 내보낼 데이터 배열
 * @param {string} filename - 파일명
 * @param {Object} options - 옵션
 */
export function exportToJSON(data, filename = 'netmood-data.json', options = {}) {
  if (!data || data.length === 0) {
    throw new Error('내보낼 데이터가 없습니다');
  }

  const {
    startDate,
    endDate,
    columns = null,
  } = options;

  // 날짜 필터링
  let filteredData = data;
  if (startDate || endDate) {
    filteredData = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;
      return true;
    });
  }

  // 컬럼 필터링
  if (columns && columns.length > 0) {
    filteredData = filteredData.map(item => {
      const filtered = {};
      columns.forEach(col => {
        if (item[col] !== undefined) {
          filtered[col] = item[col];
        }
      });
      return filtered;
    });
  }

  // JSON 문자열 생성
  const jsonContent = JSON.stringify(filteredData, null, 2);
  
  // 다운로드
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 파일명 생성
 * @param {string} type - 파일 타입 ('csv' | 'json')
 * @param {Date} date - 날짜 (기본값: 현재 날짜)
 * @returns {string} 파일명
 */
export function generateFilename(type = 'csv', date = new Date()) {
  const dateStr = date.toISOString().split('T')[0];
  const extension = type === 'json' ? 'json' : 'csv';
  return `netmood-${dateStr}.${extension}`;
}

