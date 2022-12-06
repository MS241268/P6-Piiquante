const express = require ('express')
const router = express.Router()

const userCtrl = require ('../controllers/user')
const checkPassword = require (`../middleware/checkPassword`)
const checkEmail = require (`../middleware/checkEmail`)

router.post('/signup',checkEmail, checkPassword, userCtrl.signup)//Création route pour l'inscription de l'utilisateur
router.post('/login', userCtrl.login)//Création route pour la connexion de l'utilisateur

module.exports = router