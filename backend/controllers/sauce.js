const Sauce = require("../models/Sauce")
const fs = require('fs')//Importation du module 'fs' (file system) de NodeJS

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
		// usersLiked: [],
		// usersDisliked: []
	})
	sauce.save()//Enregistrement dans la data base
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
	Sauce.findOne({ _id: req.params.id })//Selection de l'objet dans la data base
		.then((sauce) => {
			//L'utilisateur est il le propriétaire de l'objet ?
			if (sauce.userId != req.auth.userId) {// Si l'utilisateur n'est pas le propriétaire
				res.status(401).json ({ message : 'Autorisation KO !' })
			} else {
				if (req.file) {// Si l'utilisateur est le propriétaire
						Sauce.findOne({ _id: req.params.id })//Selection de l'objet dans la data base
							.then((sauce) => {
							//Récupération du nom de l'image à supprimer dans la data base
							const filename = sauce.imageUrl.split('/images')[1]

							//Suppression de l'image dans dossier 'images' du serveur
							fs.unlink(`images/${filename}`, (error) => {
								if(error) throw error
							})
						})
							.catch((error) => res.status(404).json({ error}))
				}

	//Objet mis à jour dans la data base => 2 cas possibles : Le propriétaire modifie l'objet avec une nouvelle image OU modifie uniquement le 'formulaire' de la sauce
	const sauceObject = req.file ? {//Y a t il une image dans l'objet ?
		//Si une image existe dans l'objet modifié
		...JSON.parse(req.body.sauce),// => transformation de la chaîne de caractères en objet JS
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//Remplacement de l'image par la nouvelle
	} : {
		//Si aucune image n'est dans l'objet modifié
		...req.body
	}
	//MàJ de la data base
	delete sauceObject._id//Suppression l'id de la requête (Sécurité : évite de créer un objet à son nom et eviter qu'il modifie l'objet et le réassigne à un autre utilisateur)
	Sauce.updateOne ({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Objet modifié !'})})
		.catch(error => res.status(404).json({ error }))
					//})
				}
	})
	.catch((error) => {
		res.status(400).json({ error })
	})
}
/****/

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id})//Récupération de l'objet dans la base de données et mise en forme de la clé "_id :"
		.then(sauce => {
			if(sauce.userId != req.auth.userId) {//Vérification si l'utilisateur est propriétaire de l'objet
				res.status(401).json({ message: 'Autorisation KO !' })
			} else {
				const filename = sauce.imageUrl.split('/images')[1]//Récupération du nom de l'image à supprimer
				fs.unlink(`images/${filename}`, () => {//suppression de l'image sur le serveur
					Sauce.deleteOne({ _id: req.params.id })
						.then(() => {res.status(200).json({ message: 'Objet Supprimé !'})})
						.catch(error => res.status(401).json({ error }))
				})
			}
		})
		.catch(error => {
			res.status(500).json({ error })
		})
}
/****/

exports.likeDislikeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })//Récupération de l'objet dans la base de données et mise en forme de la clé "_id :"
		.then((sauce) => {
			
			//L'utilisateur like
			if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){//Si l'utilisateur n'est pas dans le tableau 'userLiked' ET qu'il like l'objet
			
				//MàJ dans la data base de l'objet
				Sauce.updateOne(
					{ _id : req.params.id },//Récupération de l'objet dans la base de données et mise en forme de la clé "_id :"
					{$inc: {likes : 1} ,//"$inc" opérateur MongoDB (incrémentation du total de likes de +1 )
					 $push: {usersLiked : req.body.userId}},//"$push" opérateur MongoDB (Référencement de l''userId' qui a liké dans le tableau "usersLiked")
				)
					.then(() => res.status(201).json( { message: "userId : " + req.body.userId + " : ajout du like !"} ))

					.catch((error) => res.status(400).json({ error }))
					
			}
			/****/

			//L'utilisateur annule son like 
			if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){//Si l'utilisateur est dans le tableau 'userLiked' ET annule son like sur l'objet

				//MàJ dans la data base de l'objet
				Sauce.updateOne(
					{ _id : req.params.id },//Récupération de l'objet dans la base de données et mise en forme de la clé "_id :"
					{$inc: {likes : -1} ,//"$inc" opérateur MongoDB (décrémentation du total de likes de -1)
					$pull: {usersLiked : req.body.userId}},//"$pull" opérateur MongoDB (suppression de l''userId' qui annule son like dans le tableau "usersLiked")
				)
					.then(() => res.status(201).json( { message: "userId : " + req.body.userId + " : annulation du like !"} ))

					.catch((error) => res.status(400).json({ error }))	
			}
			/****/

			//L'utilisateur dislike
			if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){//Si l'utilisateur n'est pas dans le tableau 'userDisliked' ET qu'il dislike l'objet
			
				//MàJ dans la data base de l'objet
				Sauce.updateOne(
					{ _id : req.params.id },//Récupération de l'objet dans la base de données et mise en forme de la clé "_id :"
					{$inc: {dislikes : 1} ,//"$inc" opérateur MongoDB (incrémentation du total de dislikes de +1 )
					 $push: {usersDisliked : req.body.userId}},//"$push" opérateur MongoDB (Référencement de l''userId' qui a disliké dans le tableau "usersLiked")
				)
					.then(() => res.status(201).json( { message: "userId : " + req.body.userId + " : ajout du dislike !"} ))

					.catch((error) => res.status(400).json({ error }))
					
			}
			/****/

			//L'utilisateur annule son dislike 
			if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){//Si l'utilisateur est dans le tableau 'userDisliked' ET annule son dislike sur l'objet

				//MàJ dans la data base de l'objet
				Sauce.updateOne(
					{ _id : req.params.id },//Récupération de l'objet dans la base de données et mise en forme de la clé "_id :"
					{$inc: {dislikes : -1} ,//"$inc" opérateur MongoDB (décrémentation du total de dislikes de -1)
					$pull: {usersDisliked : req.body.userId}},//"$pull" opérateur MongoDB (suppression de l''userId' qui annule son dislike dans le tableau "usersLiked")
				)
					.then(() => res.status(201).json( { message: "userId : " + req.body.userId + " : annulation du dislike !"} ))

					.catch((error) => res.status(400).json({ error }))	
			}
			/****/
		})
		.catch((error) => res.status(404).json({ error }))
}