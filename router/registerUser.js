const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
});

const validate = (credentials) => Joi.validate(credentials, userSchema);

async function registerUser(req, res, next) {
  try {
    const validationResult = validate(req.body);
    if (validationResult.error) {
      res.redirect('/registration')
      return
    }

    const user = await User.findOne({username: validationResult.value.username});
    if(user){
      res.redirect('/registration');
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(validationResult.value.password, saltRounds);

    validationResult.value.password = hash

    const newUser = await new User(validationResult.value)
    await newUser.save()

    res.redirect('/');
  } catch(error){
    next(error);
  }
}

module.exports = registerUser;
