// Middleware qui vérifie que l'utilisateur est authentifié
// avant d'autoriser l'envoi de ses requêtes.

//  On importe le package jsonwebtoken
const jwt = require("jsonwebtoken");
// Module pour masquer les informations du token à l'aide de variables d'environnement (.env)
require("dotenv").config();

// Vérifie le TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken["userId"];

    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("userId non valable !");
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error("Requête non authentifiée !") });
  }
};
