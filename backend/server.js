// Ecoute des requetes http et reponse, connexion de notre serveur à l'application

const http = require("http");
// Import de notre apllication pour l'utilisation de l'application sur le serveur
const app = require("./app");

// La fonction normalizePort renvoie un port valide, qu'il soit sous forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Configuration du port de connection en fonction de l'environnement
const port = normalizePort(process.env.PORT || "3000");

//Stockage du port de connection
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Création d'un serveur avec express, on lui passe notre application
const server = http.createServer(app);

// Lance le serveur et affiche sur quel port se connecter
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Le serveur écoute le port qui à été stocké
server.listen(port);
