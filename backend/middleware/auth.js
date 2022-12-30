const jwt = require ('jsonwebtoken')

module.exports = (req, res, next) => {
	try {//try & catch : permet de gérer les erreurs en analysant le type d'erreur
		const token = req.headers.authorization.split(' ')[1]//Récupération du token en allant dans l'en-tête de requête 'authorization'
		const decodedToken = jwt.verify(token, process.env.DECRYPT_KEY)//Décodage et Vérification du token avec en argument le token et la clef secrète
		const userId = decodedToken.userId//Récupération de l'userId dans le token
		//Ajout du userid décodé à l'objet 'request' qui est transmis aux différentes routes 'sauce'
		req.auth = {
			userId: userId
		}
		/****/
	next()
	} catch(error) {
		res.status(401).json({ error })
	} 
}