import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport.config.js';
import routes from './routes/routes.js';
import { notFound } from './common/middlewares/notFound.middleware.js';
import { errorHandler } from './common/middlewares/errorHandler.middleware.js';
import 'dotenv/config';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Dynamically allow requesting origin for seamless cross-origin auth
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});


app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
