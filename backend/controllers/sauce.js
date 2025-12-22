const Sauce = require('../models/Sauce');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); //Importation du module 'fs' (file system) de NodeJS

//Visualisation de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
/****/

//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //Conversion corps de la requête (Cractéristiques sauce renseignées par l'utilisateur) de texte en tableau tableau
  delete sauceObject._id; //Suppression de l'Id sauce issue du frontend
  delete sauceObject._userId; //Suppression de l'Id utilisateur
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId, //Authentification de l'utilisateur via le token (pour plus de fiabilité)
    imageUrl: req.file.path, //Chemin où sera située l'image dans le backend
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save() //Enregistrement dans la data base
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
/****/

//visualisation d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
/****/

//Modification d'une sauce
exports.updateSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Autorisation KO !' });
      }

      // Si une nouvelle image est uploadée
      if (req.file && sauce.imageUrl) {
        // extraire public_id Cloudinary à partir de l'URL
        const segments = sauce.imageUrl.split('/');
        const publicIdWithExt = segments[segments.length - 1]; // ex: name_123456.jpg
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // enlever extension

        // Supprimer l'ancienne image sur Cloudinary
        cloudinary.uploader.destroy(
          `p6_sauces/${publicId}`,
          (error, result) => {
            if (error) console.error('Erreur suppression Cloudinary :', error);
          }
        );

        // Mettre à jour l'imageUrl avec la nouvelle image Cloudinary
        sauce.imageUrl = req.file.path;
      }

      // Mettre à jour les autres champs
      const sauceObject = req.body;
      Object.assign(sauce, sauceObject);

      // Sauvegarde finale
      sauce
        .save()
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

/****/

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Autorisation KO !' });
      }

      // Supprimer l'image sur Cloudinary si elle existe
      if (sauce.imageUrl) {
        const segments = sauce.imageUrl.split('/');
        const publicIdWithExt = segments[segments.length - 1]; // ex: name_123456.jpg
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // enlever extension

        cloudinary.uploader.destroy(`p6_sauces/${publicId}`, (err, result) => {
          if (err) console.error('Erreur suppression Cloudinary :', err);
        });
      }

      // Supprimer la sauce dans MongoDB
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet Supprimé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
/****/

exports.likeDislikeSauce = (req, res, next) => {
  if (req.body.userId !== req.auth.userId) {
    //L'utilisateur ne correspond pas à l'utilisateur fourni par le token
    return res.status(401).json({ message: 'Non autorisé !' });
  } else {
    //L'utilisateur correspond à l'utilisateur fourni par le token
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //Récupération de l'objet dans la base de données
        //L'utilisateur like
        if (
          !sauce.usersLiked.includes(req.body.userId) &&
          req.body.like === 1
        ) {
          //Si l'utilisateur n'est pas dans le tableau 'userLiked' ET qu'il like l'objet

          //MàJ dans la data base de l'objet
          Sauce.updateOne(
            { _id: req.params.id }, //Récupération de l'objet dans la base de données
            {
              $inc: { likes: 1 }, //"$inc" opérateur MongoDB (incrémentation du total de likes de +1 )
              $push: { usersLiked: req.body.userId },
            } //"$push" opérateur MongoDB (Référencement de l''userId' qui a liké dans le tableau "usersLiked")
          )
            .then(() =>
              res.status(201).json({
                message: 'userId : ' + req.body.userId + ' : ajout du like !',
              })
            )

            .catch((error) => res.status(400).json({ error }));
        }
        /****/

        //L'utilisateur annule son like
        if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
          //Si l'utilisateur est dans le tableau 'userLiked' ET annule son like sur l'objet

          //MàJ dans la data base de l'objet
          Sauce.updateOne(
            { _id: req.params.id }, //Récupération de l'objet dans la base de données
            {
              $inc: { likes: -1 }, //"$inc" opérateur MongoDB (décrémentation du total de likes de -1)
              $pull: { usersLiked: req.body.userId },
            } //"$pull" opérateur MongoDB (suppression de l''userId' qui annule son like dans le tableau "usersLiked")
          )
            .then(() =>
              res.status(201).json({
                message:
                  'userId : ' + req.body.userId + ' : annulation du like !',
              })
            )

            .catch((error) => res.status(400).json({ error }));
        }
        /****/

        //L'utilisateur dislike
        if (
          !sauce.usersDisliked.includes(req.body.userId) &&
          req.body.like === -1
        ) {
          //Si l'utilisateur n'est pas dans le tableau 'userDisliked' ET qu'il dislike l'objet

          //MàJ dans la data base de l'objet
          Sauce.updateOne(
            { _id: req.params.id }, //Récupération de l'objet dans la base de données
            {
              $inc: { dislikes: 1 }, //"$inc" opérateur MongoDB (incrémentation du total de dislikes de +1 )
              $push: { usersDisliked: req.body.userId },
            } //"$push" opérateur MongoDB (Référencement de l''userId' qui a disliké dans le tableau "usersLiked")
          )
            .then(() =>
              res.status(201).json({
                message:
                  'userId : ' + req.body.userId + ' : ajout du dislike !',
              })
            )

            .catch((error) => res.status(400).json({ error }));
        }
        /****/

        //L'utilisateur annule son dislike
        if (
          sauce.usersDisliked.includes(req.body.userId) &&
          req.body.like === 0
        ) {
          //Si l'utilisateur est dans le tableau 'userDisliked' ET annule son dislike sur l'objet

          //MàJ dans la data base de l'objet
          Sauce.updateOne(
            { _id: req.params.id }, //Récupération de l'objet dans la base de données
            {
              $inc: { dislikes: -1 }, //"$inc" opérateur MongoDB (décrémentation du total de dislikes de -1)
              $pull: { usersDisliked: req.body.userId },
            } //"$pull" opérateur MongoDB (suppression de l''userId' qui annule son dislike dans le tableau "usersLiked")
          )
            .then(() =>
              res.status(201).json({
                message:
                  'userId : ' + req.body.userId + ' : annulation du dislike !',
              })
            )

            .catch((error) => res.status(400).json({ error }));
        }
        /****/
      })
      .catch((error) =>
        res.status(404).json({ message: 'Sauce non trouvée !' })
      );
  }
};
