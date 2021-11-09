// Création du router qui contient les routes de L'api pour les sauces

const express = require("express");
// Appel du routeur pour séparer les routes de notre fichier
const router = express.Router();
// Import des controllers contenant la logique métier
const saucesCtrl = require("../controllers/Sauces");
// Import du middleware d'authentification pour sécuriser nos routes
const auth = require("../middleware/auth");
// Import du middleware multer pour le format de nos images
const multer = require("../middleware/multer-config");

// Routes de l'API pour les sauces on leur passe les middlewares, auth avant multer sinon
// les images de requete non identifie peuvent être enregistrées, puis les controllers

// Route pour la création de sauces
router.post("/", auth, multer, saucesCtrl.createSauces);
// Route pour la modification de sauces
router.put("/:id", auth, multer, saucesCtrl.modifySauces);
// Route pour supprimer une sauces
router.delete("/:id", auth, saucesCtrl.deleteSauces);
// Route pour obtenir une sauces précise
router.get("/:id", auth, saucesCtrl.getOneSauce);
// Route pour récupérer toutes les sauces
router.get("/", saucesCtrl.getAllSauces);
// Route pour gérer les likes et dislikes des sauces
router.post("/:id/like", auth, saucesCtrl.likeAndDislike);

module.exports = router;
