const passwordValidator = require ('password-validator')

const passwordSchema = new passwordValidator()

passwordSchema
.is().min(8) // Minimum 8 caractères
.is().max(20) // Maximum 20 caractères
.has().uppercase() // Doit comporter au moins 1 majuscule
.has().lowercase() // Doit comporter des minuscules
.has().digits(2) // Doit comporter au moins 2 chiffres
.has().not().spaces() // Ne doit pas comporter d'espace  

module.exports = passwordSchema