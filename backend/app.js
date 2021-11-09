// Appel des différentes fonctions middleware implémentées dans l'API

// Import des modules npm - Ajout des plugins externes

// Importation d'express, framework basé sur node.js pour construire notre application
const express = require("express");
// Plugin Mongoose pour se connecter à la data base Mongo DB
const mongoose = require("mongoose");
// Plugin qui accède au chemin du serveur
const path = require("path");
// Module pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement (.env)
require("dotenv").config();
// Aide à sécuriser l'application Express en définissant divers en-têtes HTTP (protection contre injection)
const helmet = require("helmet");

// Import des routes dédiée aux sauces et users
const saucesRoutes = require("./routes/Sauces");
const userRoutes = require("./routes/user");
// Connection à la base de données MongoDB, sécurisé avec la variables d’environnement
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création d'une application express
const app = express();

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Transforme les données arrivant de la requête en un objet JSON
app.use(express.json());
// On apelle Helmet pour chaque requête envoyées au serveur
app.use(helmet());
// Indique a express qu il faut enregistrer nos ressources dans le dossier 'images' de maniere statique
app.use("/images", express.static(path.join(__dirname, "images")));
// Importe toutes les routes dédiées aux sauces sur ce endpoint
app.use("/api/sauces", saucesRoutes);
// Importe toutes les routes dédiées aux users sur ce endpoint
app.use("/api/auth", userRoutes);

// Export de notre l'application pour notre serveur
module.exports = app;
