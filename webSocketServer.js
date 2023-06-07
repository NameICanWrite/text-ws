import {WebSocketServer} from 'ws'

export function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  // Store the connected WebSocket clients
  const wsClients = new Set();

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    wsClients.add(ws);
    console.log('A client connected');

    // WebSocket close handler
    ws.on('close', () => {
      wsClients.delete(ws);
      console.log('A client disconnected');
    });
  });



  return {
    wss,
    wsClients,
  };
}
