import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.8.4"]);

import app from './app.js';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import { startWeatherAlertScheduler, stopWeatherAlertScheduler } from './features/alerts/alert.scheduler.js';

const startServer = async () => {
  await connectDB();

  // Initialize automated real-time weather & hazard alert cron scheduler
  startWeatherAlertScheduler();

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`[server] Running in ${process.env.NODE_ENV || 'production'} mode on port ${port}`);
  });


  const shutdown = (signal) => {
    console.log(`[server] ${signal} received. Shutting down gracefully...`);
    stopWeatherAlertScheduler();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (err) => {
    console.error('[server] Unhandled Rejection:', err);
    stopWeatherAlertScheduler();
    server.close(() => process.exit(1));
  });
};

startServer();

