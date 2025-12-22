const multer = require('multer'); //Importation multer
const path = require('path');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

//Création objet de configuration pour multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folder =
      process.env.NODE_ENV === 'production' ? 'images_prod' : 'images';
    callback(null, path.join(__dirname, '..', folder));
  },
  filename: (req, file, callback) => {
    const name = path
      .parse(file.originalname) //Renommage du fichier en remplaçant ' ' par '_'
      .name.replace(/\s+/g, '_');
    const extension = MIME_TYPES[file.mimetype]; //Extension du fichier
    callback(null, `${name}_${Date.now()}.${extension}`); //Fichier avec nom + horodatage (permet que l'image soit unique) + '.' + extension
  },
});
/****/
module.exports = multer({ storage: storage }).single('image');
