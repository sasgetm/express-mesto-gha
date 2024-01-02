const Card = require('../models/card');
const err500 = "На сервере произошла ошибка. ";
const err400 = "Переданы некорректные данные при создании карточки. ";
const err404 = "Передан несуществующий _id карточки";
const errLikeCard = "Переданы некорректные данные для постановки лайка";
const errDislikeCard = "Переданы некорректные данные для снятия лайка";

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err500 + err.name + ":" + err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err400 + err.name + ': ' + err.message });
        return;
      }
      res.status(500).send({ message: err500 + err.name + ":" + err.message })
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: err404 });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: err500 + err.name + ":" + err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: err404 });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: errLikeCard });
        return;
      }
      res.status(500).send({ message: err500 + err.name + ":" + err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: err404 });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: errDislikeCard });
        return;
      }
      res.status(500).send({ message: err500 + err.name + ":" + err.message });
    });
};
