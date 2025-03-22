import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import notificationRoutes from './routes/notifications.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

mongoose.connect('mongodb://localhost:3000/elite-auto-auctions')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data);
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(5000, () => console.log('Server running on port 5000'));
