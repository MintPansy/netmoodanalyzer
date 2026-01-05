// Netlify Functions - System Status and Health Check
// This function provides system status and health monitoring

const crypto = require('crypto');

// System health metrics
function generateSystemHealth() {
  const uptime = Math.floor(Math.random() * 86400); // Random uptime in seconds
  const memoryUsage = {
    used: Math.floor(Math.random() * 2048) + 512, // MB
    total: 4096,
    percentage: 0
  };
  memoryUsage.percentage = Math.floor((memoryUsage.used / memoryUsage.total) * 100);
  
  const cpuUsage = Math.floor(Math.random() * 60) + 10; // 10-70% CPU usage
  
  return {
    uptime,
    memory: memoryUsage,
    cpu: cpuUsage,
    status: cpuUsage < 80 && memoryUsage.percentage < 90 ? 'healthy' : 'warning',
    timestamp: new Date().toISOString()
  };
}

// Generate connection statistics
function generateConnectionStats() {
  return {
    activeConnections: Math.floor(Math.random() * 50) + 1,
    totalRequests: Math.floor(Math.random() * 10000) + 1000,
    requestsPerMinute: Math.floor(Math.random() * 100) + 10,
    averageResponseTime: Math.floor(Math.random() * 200) + 50, // milliseconds
    errorRate: Math.random() * 5 // 0-5% error rate
  };
}

// Format uptime in human readable format
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.httpMethod === 'GET') {
    try {
      const systemHealth = generateSystemHealth();
      const connectionStats = generateConnectionStats();
      
      const response = {
        success: true,
        system: {
          status: systemHealth.status,
          uptime: systemHealth.uptime,
          uptimeFormatted: formatUptime(systemHealth.uptime),
          memory: systemHealth.memory,
          cpu: systemHealth.cpu,
          timestamp: systemHealth.timestamp
        },
        connections: connectionStats,
        services: {
          realtimeData: {
            status: 'running',
            endpoint: '/.netlify/functions/realtime-data'
          },
          streamingData: {
            status: 'running',
            endpoint: '/.netlify/functions/streaming-data'
          },
          systemStatus: {
            status: 'running',
            endpoint: '/.netlify/functions/system-status'
          }
        },
        metadata: {
          version: '1.0.0',
          environment: 'netlify',
          region: 'auto',
          generatedAt: new Date().toISOString()
        }
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response, null, 2)
      };
      
    } catch (error) {
      console.error('Error in system-status function:', error);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
          message: error.message,
          timestamp: new Date().toISOString()
        })
      };
    }
  }
  
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed'
    })
  };
};