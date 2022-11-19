const jwt = require ('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]//Récupération du token en allant dans l'en-tête de requête 'authorization'
		const decodedToken = jwt.verify(token, 'RAMDOM_TOKEN_SECRET')//Décodage et Vérification du token avecenargument le token et la clef secrète
		const userId = decodedToken.userId//Récupération de l'userId dans le token
		req.auth = {
			userId: userId
		}
	} catch(error) {
		res.status(401).json({ error })
	} 
}