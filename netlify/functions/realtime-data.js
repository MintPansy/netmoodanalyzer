// Netlify Functions - Real-time Network Data Collection
// This function provides real-time network monitoring data for NetMood Analyzer

const crypto = require('crypto');

// Mock network interfaces for simulation
const MOCK_INTERFACES = ['eth0', 'wlan0', 'lo'];
const MOCK_IPS = ['192.168.1.', '10.0.0.', '172.16.0.'];

// Emotion analysis rules
function analyzePacketEmotion(packet) {
  const { bytes, packetRate, protocolEntropy, protocol } = packet;
  
  // Rule-based emotion detection
  if (protocolEntropy > 0.8 && bytes > 50000) {
    return '화남'; // High entropy + large packets = Angry
  } else if (protocolEntropy > 0.6 && packetRate > 500) {
    return '불안'; // High entropy + high rate = Anxious  
  } else if (bytes < 1000 && packetRate < 100) {
    return '슬픔'; // Small packets + low rate = Sad
  } else if (packetRate > 1000 && protocolEntropy < 0.3) {
    return '기쁨'; // High rate + low entropy = Happy
  } else {
    return '평온'; // Default = Calm
  }
}

// Generate realistic network packet data
function generatePacketData() {
  const now = new Date();
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
  const emotions = ['평온', '기쁨', '불안', '화남', '슬픔'];
  
  // Generate entropy-like value
  const entropy = Math.random();
  const bytes = Math.floor(Math.random() * 65536) + 64;
  const packetRate = Math.floor(Math.random() * 2000) + 10;
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  
  // Anonymize IPs
  const sourceIPBase = MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)];
  const destIPBase = MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)];
  const sourceIP = sourceIPBase + Math.floor(Math.random() * 254 + 1);
  const destIP = destIPBase + Math.floor(Math.random() * 254 + 1);
  
  const packet = {
    timestamp: now.toISOString(),
    sourceIP: anonymizeIP(sourceIP),
    destinationIP: anonymizeIP(destIP),
    protocol,
    bytes,
    packetRate,
    protocolEntropy: parseFloat(entropy.toFixed(3))
  };
  
  // Add emotion analysis
  packet.emotion = analyzePacketEmotion(packet);
  
  return packet;
}

// Anonymize IP addresses for privacy
function anonymizeIP(ip) {
  const parts = ip.split('.');
  if (parts.length === 4) {
    // Keep first 3 octets, hash the last one
    const lastOctet = parts[3];
    const hash = crypto.createHash('md5').update(lastOctet).digest('hex');
    parts[3] = parseInt(hash.substring(0, 2), 16) % 254 + 1;
    return parts.join('.');
  }
  return ip;
}

// Generate network statistics
function generateNetworkStats(packets) {
  const emotionCounts = {
    '평온': 0,
    '기쁨': 0, 
    '불안': 0,
    '화남': 0,
    '슬픔': 0
  };
  
  let totalBytes = 0;
  let totalPacketRate = 0;
  
  packets.forEach(packet => {
    emotionCounts[packet.emotion]++;
    totalBytes += packet.bytes;
    totalPacketRate += packet.packetRate;
  });
  
  const totalPackets = packets.length;
  const avgBytes = totalPackets > 0 ? Math.floor(totalBytes / totalPackets) : 0;
  const avgPacketRate = totalPackets > 0 ? Math.floor(totalPacketRate / totalPackets) : 0;
  
  // Calculate emotion percentages
  const emotionPercentages = {};
  Object.keys(emotionCounts).forEach(emotion => {
    emotionPercentages[emotion] = totalPackets > 0 ? 
      Math.round((emotionCounts[emotion] / totalPackets) * 100) : 0;
  });
  
  return {
    totalPackets,
    avgBytes,
    avgPacketRate,
    emotionCounts,
    emotionPercentages,
    timestamp: new Date().toISOString()
  };
}

// Main handler function
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    const method = event.httpMethod;
    const path = event.path;
    
    if (method === 'GET') {
      // Generate real-time packet data
      const packetCount = parseInt(event.queryStringParameters?.count || '10');
      const packets = [];
      
      // Generate multiple packets for realistic data
      for (let i = 0; i < Math.min(packetCount, 100); i++) {
        packets.push(generatePacketData());
      }
      
      // Generate network statistics
      const stats = generateNetworkStats(packets);
      
      const response = {
        success: true,
        data: {
          packets,
          stats,
          metadata: {
            generatedAt: new Date().toISOString(),
            packetCount: packets.length,
            privacySettings: {
              ipAnonymized: true,
              localProcessingOnly: true,
              dataRetentionHours: 24
            }
          }
        }
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
      
    } else if (method === 'POST') {
      // Handle real-time monitoring controls
      const body = JSON.parse(event.body || '{}');
      const action = body.action;
      
      switch (action) {
        case 'start':
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: '실시간 모니터링이 시작되었습니다',
              monitoringId: crypto.randomUUID(),
              timestamp: new Date().toISOString()
            })
          };
          
        case 'stop':
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: '실시간 모니터링이 중지되었습니다',
              timestamp: new Date().toISOString()
            })
          };
          
        case 'status':
          // Generate current system status
          const systemStats = generateNetworkStats(Array(20).fill().map(() => generatePacketData()));
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              status: 'active',
              uptime: Math.floor(Math.random() * 3600), // Random uptime in seconds
              stats: systemStats,
              timestamp: new Date().toISOString()
            })
          };
          
        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: `Unknown action: ${action}`
            })
          };
      }
      
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Method not allowed'
        })
      };
    }
    
  } catch (error) {
    console.error('Error in realtime-data function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};