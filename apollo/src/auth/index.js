import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


import { AuthenticationError, UserInputError } from 'apollo-server'

const JWT_SECRET = process.env.PRISMA_SECRET

/*
  @param {Object} user - user info pulled from database

  Creates a token storing user id and email. Expires in 12 hours
*/
export function generateToken(user) {

  const payload = {
    id: user.id,
    email: user.email,
  };
  const options = {
    expiresIn: '3d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

/*
  @param String -- string passed to hashPassword from argument object.

  Checks length of password, throws error if insufficient, and returns hash password
*/
export function hashPassword(password) {
  if (password.length < 8) {
    throw new UserInputError('Password must be at least 8 characters.')
  }

  return bcrypt.hashSync(password, 10)
}

/* 
  @param {Object} context - Contains request object

  Gets user ID from token stored in the authorization header. If there is no token or 
  if it is expired, it will throw an error.

  @return {ID} userId - User ID stored in token
*/
export function getUserId(request) {
  const authorization = request.get('Authorization')

  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const { id: userId } = jwt.verify(token, JWT_SECRET)
    return userId
  }
  throw new AuthenticationError('Not Authenticated.')
}
