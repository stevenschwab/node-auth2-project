const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const { JWT_SECRET, BCRYPT_ROUNDS } = require("../secrets"); // use this secret!
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../users/users-model')

router.post("/register", validateRoleName, (req, res, next) => {
  let { username, password, role_name } = req.body
  
  const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
  password = hash
  role_name = req.role_name

  Users.add({ username, password, role_name })
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)
});


router.post("/login", checkUsernameExists, (req, res, next) => {
  let { username, password } = req.body

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user)
        res.json({ message: `${username} is back!`, token })
      } else {
        next({ status: 401, message: "Invalid Credentials" })
      }
    })
    .catch(next)
});

function buildToken(user) {
  const payload = {
    subject: user.user_id,
    username: user.username,
    role_name: user.role_name
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
