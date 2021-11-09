// Middlewre pour la vérification du mot de passe user, doit correspondre au modèle défini
const passwordSchema = require("../models/passwordValidator");

// Vérification du mot de passe user, doit correspondre au modèle défini

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        "Le mot de passe doit faire 10 caractère au moins, avec une majuscule, une minuscule et un chiffre au moins.",
    });
  } else {
    next();
  }
};
