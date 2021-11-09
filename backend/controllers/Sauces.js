// Logique métier pour nos routes de sauces

// Récupération du modèle de sauce
const Sauce = require("../models/Sauces");
// Import package fs de node, pour l'appel de fonctions permettant de supprimer les fichiers.
const fs = require("fs");

// Créer une nouvelle sauce
exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // le frontend genere un id, on le supprime car MongoDB en créé un
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(200).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauces = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce["imageUrl"].split("/images")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupère une sauce, identifiée par son id depuis la base MongoDB
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Récupère toutes les sauces de la base MongoDB
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
// Permet de "liker"ou "dislaker" une sauce
exports.likeAndDislike = (req, res, next) => {
  console.log(req.body);
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(404).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(404).json({ error }));
  } else if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauces) => {
        if (sauces["usersLiked"].find((user) => user === req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => res.status(404).json({ error }));
        }
        if (sauces["usersDisliked"].find((user) => user === req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => res.status(404).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }
};
