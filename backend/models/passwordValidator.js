// Création d'un schema mangoose pour les mots de passe des users

// Plugin pour définir le format du mot de passe
const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

//Propriétées du password
passwordSchema
  .is()
  .min(10) // Longueur minimun : 10
  .has()
  .uppercase() // Doit avoir au moins une majuscule
  .has()
  .lowercase() // Doit avoir au moins une minuscule
  .has()
  .digits() // Doit avoir au moins un chiffre
  .has()
  .not()
  .spaces() // Ne doit pas avoir d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "azerty"]); // Blacklist de valeurs à proscrire

module.exports = passwordSchema;
