import express from 'express';
import Vinyl from '../models/vinylModel.js';
import User from '../models/userModel.js';
import data from '../data.js';

const createdbRouter = express.Router();

createdbRouter.get('/', async (req, res) => {
  // cancelliamo i prodotti già presenti nel database
  await Vinyl.deleteMany({});
  // creaimo il database con i prodotti presenti in data.js
  const createdVinyls = await Vinyl.insertMany(data.vinyls);

  // cancelliamo gli utenti già presenti nel database
  await User.deleteMany({});
  // creaimo il database degli utenti
  const createdUsers = await User.insertMany(data.users);

  // restituiamo al frontend i prodotti e gli utenti appena creati
  res.send({ createdVinyls, createdUsers });
});

export default createdbRouter;
