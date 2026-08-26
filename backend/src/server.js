import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.8.4"]);

import app from './app.js';
import 'dotenv/config';
import { connectDB } from './config/db.js';

const startServer = async () => {
  await connectDB();

  const server = app.listen(process.env.PORT, () => {
    console.log(`[server] Running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received. Shutting down gracefully...`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (err) => {
    console.error('[server] Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
};

startServer();
