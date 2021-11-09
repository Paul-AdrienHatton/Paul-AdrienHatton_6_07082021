const mongoose = require("mongoose");
// On importe le package qui valide l'email unique
const uniqueValidator = require("mongoose-unique-validator");

// création du schéma de données dédié auxx users
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Veuillez entrer votre adresse email"],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Veuillez entrer une adresse email correcte",
    ],
  },
  password: {
    type: String,
    required: [true, "Veuillez choisir un mot de passe"],
  },
});

// On appel notre schéma et avec la méthode plugin et on lui passe uniqueValidator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
