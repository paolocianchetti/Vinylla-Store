import express from 'express';
import Vinyl from '../models/vinylModel.js';

const vinylRouter = express.Router();

vinylRouter.get('/', async (req, res) => {
  const vinyls = await Vinyl.find();
  res.send(vinyls);
});

vinylRouter.get('/path/:path', async (req, res) => {
  const vinyl = await Vinyl.findOne({ path: req.params.path });
  if (vinyl) {
    res.send(vinyl);
  } else {
    res.status(404).send({ message: 'Vinile non trovato!' });
  }
});

vinylRouter.get('/:id', async (req, res) => {
  const vinyl = await Vinyl.findById(req.params.id);
  if (vinyl) {
    res.send(vinyl);
  } else {
    res.status(404).send({ message: 'Vinile non trovato!' });
  }
});

export default vinylRouter;
