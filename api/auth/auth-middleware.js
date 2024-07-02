const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets"); // use this secret!
const Users = require('../users/users-model')

const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next({ status: 401, message: "Token invalid" })
      } else {
        req.decodedJwt = decoded
        next()
      }
    })
  } else {
    next({ status: 401, message: "Token required" })
  }
}

const only = role_name => (req, res, next) => {
  if (req.decodedJwt && req.decodedJwt.role_name === role_name) {
    next()
  } else {
    next({ status: 403, message: "This is not for you" })
  }
}


const checkUsernameExists = async (req, res, next) => {
  const [user] = await Users.findBy({ username: req.body.username })
  if (user) {
    next()
  } else {
    next({ status: 401, message: "Invalid credentials" })
  }
}


const validateRoleName = async (req, res, next) => {
  let { role_name } = req.body
  
  if (
    role_name == null || 
    typeof role_name !== 'string' || 
    !role_name.trim().length
  ) {
    req.role_name = 'student'
    next()
  } else if (role_name.trim() === 'admin') {
    next({ status: 422, message: "Role name can not be admin" })
  } else if (role_name.trim().length > 32) {
    next({ status: 422, message: "Role name can not be longer than 32 chars" })
  } else {
    req.role_name = role_name.trim()
    next()
  }
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}
