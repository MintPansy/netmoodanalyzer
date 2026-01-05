// Netlify Functions - WebSocket-like Streaming for Real-time Data
// This function provides Server-Sent Events (SSE) for real-time streaming

const crypto = require('crypto');

// Store active connections (in a real implementation, you'd use a database)
const activeConnections = new Map();

// Generate network packet similar to the main function but optimized for streaming
function generateStreamingPacket() {
  const now = new Date();
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH', 'FTP'];
  const emotions = ['평온', '기쁨', '불안', '화남', '슬픔'];
  
  // More realistic distribution - weighted towards calm
  const emotionWeights = {
    '평온': 0.4,
    '기쁨': 0.2,
    '불안': 0.2,
    '화남': 0.1,
    '슬픔': 0.1
  };
  
  // Generate based on current time for some patterns
  const timePattern = now.getSeconds() % 60;
  const entropy = Math.min(Math.max(0.1 + (timePattern / 60) * 0.8 + (Math.random() - 0.5) * 0.2, 0), 1);
  const bytes = Math.floor(64 + Math.random() * 32000 + Math.sin(timePattern / 10) * 10000);
  const packetRate = Math.floor(50 + Math.random() * 1500 + Math.cos(timePattern / 15) * 300);
  
  // Select emotion based on packet characteristics and weights
  let selectedEmotion = '평온';
  if (entropy > 0.8 && bytes > 40000) selectedEmotion = '화남';
  else if (entropy > 0.6 && packetRate > 800) selectedEmotion = '불안';
  else if (bytes < 500 && packetRate < 100) selectedEmotion = '슬픔';
  else if (packetRate > 1200 && entropy < 0.3) selectedEmotion = '기쁨';
  
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  
  return {
    timestamp: now.toISOString(),
    sourceIP: generateAnonymizedIP(),
    destinationIP: generateAnonymizedIP(),
    protocol,
    bytes,
    packetRate,
    protocolEntropy: parseFloat(entropy.toFixed(3)),
    emotion: selectedEmotion
  };
}

function generateAnonymizedIP() {
  const networks = ['192.168.1', '10.0.0', '172.16.0'];
  const network = networks[Math.floor(Math.random() * networks.length)];
  const lastOctet = Math.floor(Math.random() * 254) + 1;
  return `${network}.${lastOctet}`;
}

// Generate aggregated statistics for streaming
function generateStreamingStats(recentPackets) {
  const emotionCounts = {
    '평온': 0, '기쁨': 0, '불안': 0, '화남': 0, '슬픔': 0
  };
  
  recentPackets.forEach(packet => {
    emotionCounts[packet.emotion]++;
  });
  
  const total = recentPackets.length;
  const emotionPercentages = {};
  
  Object.keys(emotionCounts).forEach(emotion => {
    emotionPercentages[emotion] = total > 0 ? Math.round((emotionCounts[emotion] / total) * 100) : 0;
  });
  
  return {
    emotionCounts,
    emotionPercentages,
    totalPackets: total,
    averageBytes: total > 0 ? Math.round(recentPackets.reduce((sum, p) => sum + p.bytes, 0) / total) : 0,
    averagePacketRate: total > 0 ? Math.round(recentPackets.reduce((sum, p) => sum + p.packetRate, 0) / total) : 0,
    timestamp: new Date().toISOString()
  };
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.httpMethod === 'GET') {
    // Server-Sent Events stream
    const connectionId = crypto.randomUUID();
    const startTime = Date.now();
    
    // Generate initial data burst
    const initialPackets = Array(10).fill().map(() => generateStreamingPacket());
    const initialStats = generateStreamingStats(initialPackets);
    
    // Create SSE response
    let sseData = '';
    
    // Send initial connection event
    sseData += `event: connected\n`;
    sseData += `data: ${JSON.stringify({ 
      connectionId, 
      message: '실시간 데이터 스트림이 시작되었습니다',
      timestamp: new Date().toISOString()
    })}\n\n`;
    
    // Send initial packets
    initialPackets.forEach((packet, index) => {
      sseData += `event: packet\n`;
      sseData += `data: ${JSON.stringify(packet)}\n\n`;
    });
    
    // Send initial statistics
    sseData += `event: stats\n`;
    sseData += `data: ${JSON.stringify(initialStats)}\n\n`;
    
    // Add simulated real-time updates (for demonstration)
    const updateCount = 5; // Number of additional updates to send
    let recentPackets = [...initialPackets];
    
    for (let i = 0; i < updateCount; i++) {
      // Generate new packet
      const newPacket = generateStreamingPacket();
      recentPackets.push(newPacket);
      
      // Keep only last 20 packets for stats
      if (recentPackets.length > 20) {
        recentPackets = recentPackets.slice(-20);
      }
      
      // Send packet event
      sseData += `event: packet\n`;
      sseData += `data: ${JSON.stringify(newPacket)}\n\n`;
      
      // Send updated stats every few packets
      if ((i + 1) % 3 === 0) {
        const updatedStats = generateStreamingStats(recentPackets);
        sseData += `event: stats\n`;
        sseData += `data: ${JSON.stringify(updatedStats)}\n\n`;
      }
    }
    
    // Send completion event
    sseData += `event: complete\n`;
    sseData += `data: ${JSON.stringify({ 
      message: '데이터 스트림 샘플 완료',
      totalPackets: initialPackets.length + updateCount,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    })}\n\n`;
    
    return {
      statusCode: 200,
      headers,
      body: sseData
    };
  }
  
  if (event.httpMethod === 'POST') {
    // Handle control commands
    const body = JSON.parse(event.body || '{}');
    const { action, connectionId } = body;
    
    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };
    
    switch (action) {
      case 'heartbeat':
        return {
          statusCode: 200,
          headers: responseHeaders,
          body: JSON.stringify({
            success: true,
            connectionId: connectionId || crypto.randomUUID(),
            serverTime: new Date().toISOString(),
            status: 'active'
          })
        };
        
      case 'get_current_stats':
        const currentPackets = Array(15).fill().map(() => generateStreamingPacket());
        const currentStats = generateStreamingStats(currentPackets);
        
        return {
          statusCode: 200,
          headers: responseHeaders,
          body: JSON.stringify({
            success: true,
            stats: currentStats,
            recentPackets: currentPackets.slice(-5), // Last 5 packets
            timestamp: new Date().toISOString()
          })
        };
        
      default:
        return {
          statusCode: 400,
          headers: responseHeaders,
          body: JSON.stringify({
            success: false,
            error: `Unknown action: ${action}`
          })
        };
    }
  }
  
  return {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed'
    })
  };
};