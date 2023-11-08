import express, { query } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Vinyl from '../models/vinylModel.js';

const vinylRouter = express.Router();

const PAGE_SIZE = 3;

vinylRouter.get('/', async (req, res) => {
  const vinyls = await Vinyl.find();
  res.send(vinyls);
});

vinylRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    // destrutturiamo la query della request
    const { query } = req;
    // otteniamo i valori dei campi di ricerca dall'URL
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const genre = query.genre || '';
    const artist = query.artist || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    // definiamo dei filtri di ricerca per la funzione find di mongodb
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            $or: [
              {
                title: {
                  $regex: searchQuery,
                  $options: 'i',
                },
              },
              {
                artist: {
                  $regex: searchQuery,
                  $options: 'i',
                },
              },
            ],
          }
        : {};

    const genreFilter =
      genre && genre !== 'all'
        ? {
            genre,
          }
        : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    // cerchiamo i dischi secondo i criteri definiti prima
    // applicando la paginazione e l'ordinamento
    const vinyls = await Vinyl.find({
      ...queryFilter,
      ...genreFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const numVinyls = await Vinyl.countDocuments({
      ...queryFilter,
      ...genreFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    // restituiamo i risultati al frontend sottoforma di oggetto
    res.send({
      vinyls: vinyls,
      numVinyls: numVinyls,
      page: page,
      pages: Math.ceil(numVinyls / pageSize),
    });
  })
);

vinylRouter.get(
  '/genres',
  expressAsyncHandler(async (req, res) => {
    const genres = await Vinyl.find().distinct('genre');
    res.send(genres);
  })
);

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
