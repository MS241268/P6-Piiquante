const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:
      process.env.NODE_ENV === 'production'
        ? 'p6_sauces_prod'
        : 'p6_sauces_dev',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => {
      const name = file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/\s+/g, '_');
      return `${name}_${Date.now()}`;
    },
  },
});

module.exports = multer({ storage }).single('image');
