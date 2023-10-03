import express from 'express';
import { Server } from 'socket.io';
import { readFileSync } from 'fs';

const app = express();
const httpServer = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

const io = new Server(httpServer);

const videoQueue = ['video1.mp4', 'video2.mp4'];
let currentVideoIndex = 0;


app.use('/videos', express.static('videos'));

app.get('/', (req, res) => {
  const content = readFileSync('index.html');
  const length = Buffer.byteLength(content);

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': length,
  });
  res.end(content);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('videoQueue', { videoQueue, currentVideoIndex });

  socket.on('disconnect', (reason) => {
    console.log(`Disconnect ${socket.id} due to ${reason}`);
  });
});
