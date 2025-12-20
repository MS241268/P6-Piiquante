const express = require('express'); //Importation du package 'express'
const helmet = require('helmet'); //Importation du package 'helmet'
const mongoose = require('mongoose'); //Importation du package 'Mongoose'

const dotenv = require('dotenv'); //Importation du package 'dotenv'
dotenv.config();

const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce'); //Importation routes 'sauce'

const fs = require('fs');

// 🔹 Création du dossier images si il n'existe pas
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
  console.log('Dossier images créé automatiquement');
}

const myUrlOfDataBase = `mongodb+srv://${process.env.USER_DATABASE}:${process.env.PASSWORD_DATABASE}@${process.env.SERVER_DATABASE}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

//Connection API à la base de données MongoDB
mongoose.set('strictQuery', true),
  mongoose
    .connect(
      myUrlOfDataBase,
      {
        useNewUrlParser: true, //Plus nécessaire depuis mongoose 6 par défaut à 'true'
        useUnifiedTopology: true,
      } //Plus nécessaire depuis mongoose 6 par défaut à 'true'
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
/****/

const app = express(); //Création application

//Express-rate-limit
const rateLimit = require(`express-rate-limit`);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (conversion ms en mn)
  max: 100, // Limite de 100 requêtes par Ip pendant 15 mn sur la fenêtre en cours
  standardHeaders: true, // Retour info limite atteinte dans l'en-tête 'RateLimit-*'
  legacyHeaders: false, // Désactivation de l'en-tête 'X-RateLimit-*'
});
app.use(limiter);
/****/

//Gestion du CORS (Cross Origin Resource Sharing) qui s'appliquera à toutes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Permission pour la communication entre serveurs d'origines différentes (exemples : localhost FrontEnd : 4200 vs localhost BackEnd : 3000)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); //Ajout des headers 'Origin', 'X-Requested-With', 'Content' etc... aux requêtes envoyées vers l'API
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); //Permisson de toutes sortes de requêtes
  next();
});
/****/

//Helmet
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); //Autorisation des routes d'origine différente y compris la route statique pour la gestion des images
/****/
// 🔹 Création du dossier images_prod si il n'existe pas (pour prod)
const imagesDirProd = path.join(__dirname, 'images_prod');
if (!fs.existsSync(imagesDirProd)) {
  fs.mkdirSync(imagesDirProd);
  console.log('Dossier images_prod créé automatiquement');
}

// 🔹 Middleware pour servir les images selon l'environnement
app.use(express.json()); //Accès au corps de la requête POST si celui-ci est au format JSON
if (process.env.NODE_ENV === 'production') {
  app.use('/images', express.static(path.join(__dirname, 'images_prod')));
} else {
  app.use('/images', express.static(path.join(__dirname, 'images')));
}

// 🔹 ROUTE PING (AVANT TOUT)
app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});

//Importation de la route 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));
/****/

//Enregistrement du routeur 'user'
app.use('/api/auth', userRoutes); //Importation des routes utilisateurs 'login' & 'signup'
/****/

//Enregistrement du routeur 'sauce'
app.use('/api/sauces', sauceRoutes); //Importation de toutes les routes sauce ('getAllSauces'/'getOneSauce'/'createSauce'/'updateSauce'/'deleteSauce'/'likeDislikeSauce')
/****/

module.exports = app; //Accès de cet application aux autres fichiers notament le serveur Node
