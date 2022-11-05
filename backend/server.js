const http = require('http')//Importation du package hhtp de node
const app = require('./app')

//Renvoi d'un port valide
const normalizePort = val => {
    const port = parseInt(val, 10)//Conversion du port 'string' => nbre entier en base 10
    
    //Vérification si le port est un nombre et >= 0
    if (isNaN(port)) {
      return val
    }
    if (port >= 0) {
      return port
    }
    return false
    /****/
  }
/****/

//Détermination du port sur lequel "app" va s'éxécuter : Port dans fichier '.env' ou port 3000 par défaut
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)
/****/

//Recherche des erreurs serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.')
        process.exit(1)
        break
      default:
        throw error
    }
  }
/****/

//création du serveur
const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})

server.listen(port)//Ecoute du serveur sur un port valide si le 3000 est déjà utilisé sinon 3000 par défaut
