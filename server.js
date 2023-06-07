import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import http from 'http'
import { createWebSocketServer } from './webSocketServer.js';
dotenv.config()

const app = express()
const server = http.createServer(app)
const { wss, wsClients } = createWebSocketServer(server);
app.set('wsClients', wsClients)

app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000', process.env.CLIENT_ROOT_URL],
  methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", 'DELETE'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/text', (req, res) => {
  const text = req.body.text
  const clients = req.app.get('wsClients')

  const message = JSON.stringify({
    event: 'text',
    data: {text},
  })
  console.log(`prepared to send ws message: ${text}`);
  clients.forEach((client) => {
    client.send(message)
  })
  res.send()
})


const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Server started on port ${port}`));