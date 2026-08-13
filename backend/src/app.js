import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import helloRoutes from './routes/hello.routes.js';
import authRoutes from './routes/auth.routes.js';
import RecipeRouter from './routes/recipe.routes.js';
import SwaggerRouter from './routes/swagger-docs.routes.js';
import notFound from './middleware/not-found.middleware.js';
import errorHandler from './middleware/error-handler.middleware.js'

const app = express();

// Security & best‑practice middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:8081',
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.method, req.path, req.query);
  next();
});

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log({
      method: req.method,
      path: req.path,
      query: req.query,
      status: res.statusCode,
      headers: res.getHeaders(),
    });
  });
  next();
});

// Routes
app.use('/api/hello', helloRoutes);
app.use('/api/auth', authRoutes);

//recipe routes
app.use('/api/v1/recipes', RecipeRouter);

// swagger route
// app.use('/swagger/v1/docs', SwaggerRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.use(notFound);
app.use(errorHandler);
export default app;
