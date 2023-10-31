import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/vinyls', (req, res) => {
  res.send(data.vinyls);
});

app.get('/api/vinyls/path/:path', (req, res) => {
  const vinyl = data.vinyls.find((x) => x.path === req.params.path);
  if (vinyl) {
    res.send(vinyl);
  } else {
    res.status(404).send({ message: 'Vinile non trovato!' });
  }
});

app.get('/api/vinyls/:id', (req, res) => {
  const vinyl = data.vinyls.find((x) => x._id === req.params.id);
  if (vinyl) {
    res.send(vinyl);
  } else {
    res.status(404).send({ message: 'Vinile non trovato!' });
  }
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`il server è in ascolto su http://localhost:${port}`);
});
