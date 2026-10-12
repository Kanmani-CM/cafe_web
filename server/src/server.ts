import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  console.log(`☕ Aurora Café Backend Server is running at http://localhost:${PORT}`);
  console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
