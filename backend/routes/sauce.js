const express = require ('express')
const router = express.Router()
const auth = require ('../middleware/auth')
const multer = require ('../middleware/multer-config')//Importation du middleware multer
const sauceCtrl = require ('../controllers/sauce')

router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/', auth, multer, sauceCtrl.createSauce)
/*router.get('/:id', auth, sauceCtrl.getOneSauce)

router.put('/:id', auth, sauceCtrl.updateSauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce)*/


module.exports = router