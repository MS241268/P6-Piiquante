const passwordSchema = require('../models/Password')

module.exports = (req, res, next) => {
	if(!passwordSchema.validate(req.body.password)) {
		res.status(400).json({ message: `Le mot de passe doit comporter au moins 8 caractères, 2 chiffres, des minuscules, au moins 1 lettre majuscule et aucun espace !`})
	} else {
		next()
	}
}