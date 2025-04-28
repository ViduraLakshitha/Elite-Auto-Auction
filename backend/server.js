import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json());
app.use("/api/contact", contactRoutes);

// Remove notificationRoutes if not implemented yet
// app.use('/api/notifications', notificationRoutes);

mongoose.connect('mongodb://localhost:27017/elite-auto-auctions')  // PORT should be 27017 not 3000
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

// ✅ EXPORT the io instance
export { io };
