const express = require('express')//Importation du package 'express'
const app = express ()//Création application
const dotenv = require('dotenv')//Importation du package 'dotenv'
dotenv.config()
const myUrlOfDataBase = process.env.myUrlOfDataBase//Chargement de la variable d'environnement 'MyUrlOfDataBase' située dans le fichier '.env'
const mongoose = require('mongoose')//Importation du package 'mongoose'

//Connection API à la base de données MongoDB
mongoose.connect(myUrlOfDataBase,
    //{ useNewUrlParser: true,//Plus nécessaire depuis mongoose 6 par défaut à 'true'
    //useUnifiedTopology: true }//Plus nécessaire depuis mongoose 6 par défaut à 'true'
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
/****/

app.use((req, resp, next) => {
    console.log('Requête reçue !')
    next()//Renvoi vers le prochain middleware (fonction)
})

app.use ((req, resp, next) => {
    resp.status(201) //Modification du code de réponse 200 => 201
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

