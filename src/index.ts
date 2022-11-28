import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.listen(4004, '0.0.0.0', () => {
  console.log('server is running');
});
