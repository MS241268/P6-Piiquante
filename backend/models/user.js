const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')//Chargement du package pour email unique => Evite d'avoir plusieurs user avec même adresse mail

//Construction du schéma "user" pour Mongoose
const userSchema = mongoose.Schema ({
    email: { type: String, required: true, unique: true },//Adresse e-mail UNIQUE de l'utilisateur: champ requis
    password: { type: String, required: true },//Mot de passe de l'utilisateur haché: champ requis
})
/****/

userSchema.plugin(uniqueValidator)//Validateur 'Email unique' appliqué au schéma  avant d'en faire un modèle
module.exports = mongoose.model('User', userSchema)//Export du schéma 'user' en tant que modèle Mongoose pour l'exploiter dans MongoDB