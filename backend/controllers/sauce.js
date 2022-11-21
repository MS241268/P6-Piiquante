const Sauce = require("../models/Sauce")

//Visualisation de toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
	  .then((sauces) => res.status(200).json(sauces))
	  .catch((error) => res.status(404).json({ error }))
  }
/****/

//Création d'une sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce)//Conversion corps de la requête (Cractéristiques sauce renseignées par l'utilisateur) de texte en tableau tableau
	delete sauceObject._id//Suppression de l'Id sauce issue du frontend
	delete sauceObject._userId//Suppression de l'Id utilisateur
	const sauce = new Sauce ({
		...sauceObject,
		userId: req.auth.userId,//Authentification de l'utilisateur via le token (pour plus de fiabilité)
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//Chemin où sera située l'image dans le backend
		likes: 0,
		dislikes: 0,
		usersLiked: [' '],
		usersDisliked: [' ']
	})
	sauce.save()
	.then(() => {res.status(201).json({ message: 'Objet enregistré !' })})
	.catch(error => { res.status(400).json({ error })})
}
/****/

//visualisation d'une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id})
	.then (sauce => res.status(200).json(sauce))
	.catch(error => res.status(404).json ({ error }))
}
/****/

//Modification d'une sauce
exports.updateSauce = (req, res, next) => {
	const sauceObject = req.file ? {//Y a t il un fichier dans l'objet ?
		...JSON.parse(req.body.sauce),//Si un fichier existe dans l'objet => transormation de la chaîne de cractères en objet
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body }//Si pas de fichier récupération de l'objet

	delete sauceObject._id//Suppression l'id de la requête (Sécurité : évite de créer un objet à son nom et eviter qu'il modifie l'objet et  le réassigne à un autre utilisateur)
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			if (sauce.userId != req.auth.userId) {// Si l'utilisateur n'est pas celui qui a créé l'objet
				res.status(401).json ({ meassage : `Vous n'êtes pas auhorisé à modifier l'objet !` })
			} else {
				Sauce.updateOne ({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Objet modifié !'}))
				.catch(error => res.status(401).json({ error }))
			}
		})
		.catch((error) => {
			res.status(400).json({ error })
		})
}
/****/