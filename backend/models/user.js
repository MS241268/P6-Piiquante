const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Construction du schéma "user" pour Mongoose
const userSchema = mongoose.Schema ({
    email: {type: String, required: true, unique: true},//Adresse e-mail UNIQUE de l'utilisateur: champ requis
    password: {type: String, required: true},//Mot de passe de l'utilisateur haché: champ requis
})
/****/

userSchema.plugin(uniqueValidator)
module.exports = moongoose.model('User', userSchema)//Export du schéma 'user' en tant que modèle Mongoose pour l'exploiter dans MongoDB