const User = require('../models/user');

const err500 = 'На сервере произошла ошибка. ';
const err400 = 'Переданы некорректные данные';
const err404 = 'Пользователь по указанному _id не найден';
const errCreateUser = 'Переданы некорректные данные при создании пользователя';
const errUpdateUser = 'Переданы некорректные данные при обновлении профиля';
const errUpdateUserAvatar = 'Переданы некорректные данные при обновлении аватара';
const delimiter = ': ';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err500 + err.name + delimiter + err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: err404 });
        return;
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err400 });
        return;
      }
      res.status(500).send({ message: err500 + err.name + delimiter + err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errCreateUser });
        return;
      }
      res.status(500).send({ message: err500 + err.name + delimiter + err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: err404 });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errUpdateUser });
        return;
      }
      res.status(500).send({ message: err500 + err.name + delimiter + err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: err404 });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: errUpdateUserAvatar });
        return;
      }
      res.status(500).send({ message: err500 + err.name + delimiter + err.message });
    });
};
