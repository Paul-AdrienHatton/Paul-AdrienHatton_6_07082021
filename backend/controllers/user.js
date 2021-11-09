// Logique métier pour nos routes de users
const bcrypt = require("bcrypt");

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// On va crypter le password, créé un nouveau user avec ce password et l'email, et l'enregistrer
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({ email: req.body.email, password: hash });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// On vérifie si l'utilisateur existe dans la base MongoDB, si oui il vérifie son mot de passe,
// s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user["password"])
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
