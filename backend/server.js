import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import inputRouter from './routes/inputRoutes.js';
import vinylRouter from './routes/vinylRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connessione a mongodb stabilita...');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/input', inputRouter);
app.use('/api/vinyls', vinylRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// error handler express middleware
app.use((err, req, res, next) => {
  res.status(500).send({
    message: err.message,
  });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`il server è in ascolto su http://localhost:${port}`);
});
