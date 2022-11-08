const express = require('express')//Importation du package 'express'
const app = express ()//Création application

app.use(express.json())//Accès au corps de la requête POST si celui-ci est au format JSON

const dotenv = require('dotenv')//Importation du package 'dotenv'
dotenv.config()

const myUrlOfDataBase = process.env.URL_DATABASE//Chargement de la variable d'environnement 'MyUrlOfDataBase' située dans le fichier '.env'
const mongoose = require('mongoose')//Importation du package 'mongoose'

//Connection API à la base de données MongoDB
mongoose.connect(myUrlOfDataBase,
    //{ useNewUrlParser: true,//Plus nécessaire depuis mongoose 6 par défaut à 'true'
    //useUnifiedTopology: true }//Plus nécessaire depuis mongoose 6 par défaut à 'true'
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
/****/

//Gestion du CORS (Cross Origin Resource Sharing) qui s'appliquera à toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')//Permission pour la communication entre serveurs d'origines différentes (exemples : localhost FrontEnd : 4200 vs localhost BackEnd : 3000)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')//Ajout des headers 'Origin', 'X-Requested-With', 'Content' etc... aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')//Permisson de toutes sortes de requêtes
    next()
  });
/****/

app.use((req, resp, next) => {
    console.log('Requête reçue !')
    next()//Renvoi vers le prochain middleware (fonction)
})

app.use ((req, resp, next) => {
    resp.status(200) //Code réponse 'requête réussie'
    next()//Renvoi vers le prochain middleware (fonction)
})

app.use((req, resp, next) => {
    resp.json({ message: 'Votre requête a bien été reçue !!!'})
    next()//Renvoi vers le prochain middleware (fonction)
})

app.use((req, resp) => {//Pas de méthode "next" car c'est le dernier middleware
    console.log('Réponse envoyée avec succès !')
})

module.exports = app //Accès de cet application aux autres fichiers notament le serveur Node

