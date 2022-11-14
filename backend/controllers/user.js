const bcrypt = require ('bcrypt')

const User = require('../models/User')

//Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)//Hashage du mdp utilisateur en 10 tours d'algorythme bcrypt
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status (400).json({error}))
        })
        .catch(error => res.status (500).json({error}))//Erreur serveur
}
/****/

//Connexion utilisateur existant
exports.login =(req, res, next) => {
    User.findOne({email: req.body.email})//Recherche dans la dataBase de l'email fourni par l'utilisateur
    .then(user => {
        if (user === null){//Si utilisateur n'existe pas dans la dataBase
            res.satus(401).json({message: 'Identifiant ou mot de passe incorrect'})//Message volontairement flou pour qu'aucune indication ne soit donnée sur l'existance ou non de l'utilisateur dans la dataBase (évite la fuite des données)
        } else {//Si utilisateur existe dans la dataBase
            bcrypt.compare(req.body.password, user.password)//Comparaison du mdp fourni par l'utisateur et ceux de la dataBase
            .then(valid =>{//Réponse de la dataBase
                if (!valid) {//Si mdp incorrect
                    res.satus(401).json({message: 'Identifiant ou mot de passe incorrect'})//Message volontairement flou pour qu'aucune indication ne soit donnée sur l'existance ou non de l'utilisateur dans la dataBase (évite la fuite des données)
                } else {//Si utilisateur existant et mdp Ok
                    res.status(200).json({//Réponse ok du serveur
                        userId: user._Id,
                        token: 'TOKEN'//Founiture d'un token
                    })
                }   
            })
            .catch(error =>{
                res.status(500).json({error})//Erreur serveur
            })
        }
    })
    .catch(error =>{
        res.status(500).json({error})//Erreur serveur
    })
}