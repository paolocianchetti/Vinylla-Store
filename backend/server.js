import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import createdbRouter from './routes/createdbRoutes.js';
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

// middleware cors
app.use(cors());

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware logger
app.use(logger);

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// routes
app.use('/api/createdb', createdbRouter);
app.use('/api/vinyls', vinylRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// restituiamo la directory corrente
const __dirname = path.resolve();

// middleware che fornisce tutti i files dentro la cartella build
// del frontend come risorse statiche
app.use(express.static(path.join(__dirname, '/frontend/build')));

// dichiariamo la rotta '*'; tutte le richieste al server saranno
// soddisfatte dal file index.html dentro la cartella build
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

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
