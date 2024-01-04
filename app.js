const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const app = express();

const err404 = 'Запрашиваемый ресурс не найден';

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '6581efd82f77aedd36dbbd33',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => { res.status(404).send({ message: err404 }); });

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
