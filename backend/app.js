const express = require('express')//Importation du package 'express'
const helmet = require('helmet')//Importation du package 'helmet'

const dotenv = require('dotenv')//Importation du package 'dotenv'
dotenv.config()

const myUrlOfDataBase = `mongodb+srv://${process.env.USER_DATABASE}:${process.env.PASSWORD_DATABASE}@${process.env.SERVER_DATABASE}/?retryWrites=true&w=majority`

const mongoose = require('mongoose')//Importation du package 'Mongoose'

//Connection API à la base de données MongoDB
mongoose.connect(myUrlOfDataBase,
    //{ useNewUrlParser: true,//Plus nécessaire depuis mongoose 6 par défaut à 'true'
    //useUnifiedTopology: true }//Plus nécessaire depuis mongoose 6 par défaut à 'true'
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
/****/

const app = express()//Création application
app.use(express.json())//Accès au corps de la requête POST si celui-ci est au format JSON

//Helmet
// app.use(helmet())
// app.use(helmet.frameguard({ action: "SAMEORIGIN" }))
/****/

//Express-rate-limit
const rateLimit = require(`express-rate-limit`)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (conversion ms en mn)
	max: 100, // Limite de 100 requêtes par Ip pendant 15 mn sur la fenêtre en cours
	standardHeaders: true, // Retour info limite atteinte dans l'en-tête 'RateLimit-*'
	legacyHeaders: false, // Désactivation de l'en-tête 'X-RateLimit-*'
})
app.use(limiter)
/****/

//Gestion du CORS (Cross Origin Resource Sharing) qui s'appliquera à toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')//Permission pour la communication entre serveurs d'origines différentes (exemples : localhost FrontEnd : 4200 vs localhost BackEnd : 3000)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')//Ajout des headers 'Origin', 'X-Requested-With', 'Content' etc... aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')//Permisson de toutes sortes de requêtes
    next()
  });
/****/
// app.use(helmet())
// app.use(helmet.hidePoweredBy())
// app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})) 


//Importation routes 'user'
const userRoutes = require('./routes/user')
app.use('/api/auth', userRoutes)//Importation des routes utilisateurs 'login' & 'signup'
/****/

//Importation de toutes les routes sauce ('getAllSauces'/'getOneSauce'/'createSauce'/'updateSauce'/'deleteSauce'/'likeDislikeSauce')
const sauceRoutes = require('./routes/sauce')//Importation routes 'sauce'
app.use('/api/sauces', sauceRoutes)
/****/

//Importation de la route 'images'
const path = require('path')
app.use('/images', express.static(path.join(__dirname, 'images')))
/****/

module.exports = app //Accès de cet application aux autres fichiers notament le serveur Node

