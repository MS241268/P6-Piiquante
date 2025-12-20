const multer = require('multer'); //Importation multer

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

//Création objet de configuration pour multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // callback(null, 'images'); //Callback sur le dossier 'images'
    if (process.env.NODE_ENV === 'production') {
      callback(null, 'images_prod'); // dossier prod
    } else {
      callback(null, 'images'); // dossier local
    }
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //Renommage du fichier en remplaçant ' ' par '_'
    const extension = MIME_TYPES[file.mimetype]; //Extension du fichier
    // callback(null, name + Date.now() + '.' + extension)//Fichier avec nom + horodatage (permet que l'image soit unique) + '.' + extension
    callback(null, file.originalname);
  },
});
/****/
module.exports = multer({ storage: storage }).single('image');
