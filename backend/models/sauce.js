const mongoose = require('mongoose')

//Construction du schéma "sauce" pour Mongoose
const sauceSchema = mongoose.Schema ({
    userId: {type: String, required: true},//Nom de l'utilisateur: champ requis
    name: {type: String, required: true},//Nom de la sauce: champ requis
    manufacturer: {type: String, required: true},//Fabricant de la sauce: champ requis
    description: {type: String, required: true},//Description de la sauce: champ requis
    mainPepper: {type: String, required: true},//Principal ingrédient épicé de la sauce: champ requis
    imageUrl: {type: String, required: true},//URL de l'image de la sauce téléchargée par l'utilisateur: champ requis
    heat: {type: Number, required: true},//Nombre entre 1 et 10 décrivant la sauce: champ requis
    likes: {type: Number, required: true},//Total des 'userId' qui ont liké
    dislikes: {type: Number, required: true},//Total des 'userId' qui ont disliké
    usersLiked: {type: [String]/*, required: true*/}, //Référencement des 'userId' qui ont liké
    usersDisliked: {type: [String]/*, required: true*/},//Référencement des 'userId' qui ont disliké
})
/****/

module.exports = mongoose.model('Sauce', sauceSchema)//Export du schéma 'sauce' en tant que modèle Mongoose pour l'exploiter dans MongoDB