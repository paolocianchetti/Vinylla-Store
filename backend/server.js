import express from 'express';
import data from './data.js';

const app = express();
// test

app.get('/api/vinyls', (req, res) => {
  res.send(data.vinyls);
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`il server è in ascolto su http://localhost:${port}`);
});
