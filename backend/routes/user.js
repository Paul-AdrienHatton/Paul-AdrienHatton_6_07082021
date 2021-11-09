// Création du router qui contient les routes de L'api pour les users

const express = require("express");
const router = express.Router();
// Import des controllers contenant la logique métier
const userCtrl = require("../controllers/user");
// Import du middleware password pour la vérification du mot de passe user
const passwordValidation = require("../middleware/password");

// Routes de l'API pour les users, on leur passe les middlewares,pour la vérification du mot de passe
// et les controllers d'authentification et de sécurité

// Route pour l'inscription du users
router.post("/signup", passwordValidation, userCtrl.signup);
// Route pour la connexion du users
router.post("/login", userCtrl.login);

module.exports = router;
