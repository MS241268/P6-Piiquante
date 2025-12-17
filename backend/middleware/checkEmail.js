const validator = require(`validator`); //Importation du package 'validator'
module.exports = (req, res, next) => {
  const isMailOk = validator.isEmail(req.body.email);
  if (!isMailOk) {
    res.status(400).json({ message: `Email non conforme !` });
  } else {
    next();
  }
};
