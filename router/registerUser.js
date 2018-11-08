const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  // confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

const validate = (credentials) => Joi.validate(credentials, userSchema);

async function registerUser(req, res, next) {
  try {
    const validationResult = validate(req.body);
    if (validationResult.error) {
      // req.flash('error', 'Data entered is not valid. Please try again.')
      res.redirect('/register')
      return
    }

    const user = await User.findOne({username: validationResult.value.username});
    if(user){
      res.send('already exist');
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(validationResult.value.password, saltRounds);

    // delete validationResult.value.confirmationPassword
    validationResult.value.password = hash

    const newUser = await new User(validationResult.value)
    await newUser.save()

    res.render('successRegistration');
    // req.flash('success', 'Registration successfully, go ahead and login.')
  } catch(error){
    next(error);
  }
}

module.exports = registerUser;
