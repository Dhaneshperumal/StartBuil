const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const WebSocket = require('ws');
const app = express();
const PORT = 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to Smart City WebSocket server',
    timestamp: Date.now()
  }));
  
  // Message handler
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Echo back the message
      ws.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: Date.now()
      }));
      
      // Handle ping messages
      if (data.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error('Error handling message:', err);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });
  
  // Close handler
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// API routes
app.get('/', (req, res) => {
  res.send('Smart City API is running');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// WebSocket testing endpoint
app.get('/ws-test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WebSocket Test</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        #log { height: 300px; overflow-y: scroll; background: #f4f4f4; padding: 10px; border: 1px solid #ddd; margin-bottom: 10px; }
        button { margin-right: 10px; padding: 8px 16px; }
      </style>
    </head>
    <body>
      <h1>WebSocket Test</h1>
      <div id="log"></div>
      <div>
        <button id="connect">Connect</button>
        <button id="ping">Send Ping</button>
        <button id="custom">Send Custom Message</button>
        <button id="disconnect">Disconnect</button>
      </div>
      
      <script>
        const logElement = document.getElementById('log');
        let socket = null;
        
        function log(message) {
          const entry = document.createElement('div');
          entry.textContent = message;
          logElement.appendChild(entry);
          logElement.scrollTop = logElement.scrollHeight;
        }
        
        document.getElementById('connect').addEventListener('click', () => {
          if (socket && socket.readyState !== WebSocket.CLOSED) {
            log('Already connected');
            return;
          }
          
          const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
          const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
          
          log(\`Connecting to \${wsUrl}...\`);
          socket = new WebSocket(wsUrl);
          
          socket.onopen = () => {
            log('Connection established');
          };
          
          socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              log(\`Received: \${JSON.stringify(data, null, 2)}\`);
            } catch (err) {
              log(\`Received: \${event.data}\`);
            }
          };
          
          socket.onerror = (error) => {
            log(\`Error: \${error}\`);
          };
          
          socket.onclose = (event) => {
            log(\`Connection closed: \${event.code} \${event.reason}\`);
          };
        });
        
        document.getElementById('ping').addEventListener('click', () => {
          if (!socket || socket.readyState !== WebSocket.OPEN) {
            log('Not connected');
            return;
          }
          
          const message = {
            type: 'ping',
            timestamp: Date.now()
          };
          
          log(\`Sending: \${JSON.stringify(message)}\`);
          socket.send(JSON.stringify(message));
        });
        
        document.getElementById('custom').addEventListener('click', () => {
          if (!socket || socket.readyState !== WebSocket.OPEN) {
            log('Not connected');
            return;
          }
          
          const message = {
            type: 'custom',
            data: {
              hello: 'world',
              time: new Date().toISOString()
            }
          };
          
          log(\`Sending: \${JSON.stringify(message)}\`);
          socket.send(JSON.stringify(message));
        });
        
        document.getElementById('disconnect').addEventListener('click', () => {
          if (!socket || socket.readyState === WebSocket.CLOSED) {
            log('Not connected');
            return;
          }
          
          log('Closing connection...');
          socket.close();
        });
      </script>
    </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket server running at ws://0.0.0.0:${PORT}/ws`);
});