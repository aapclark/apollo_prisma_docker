import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.PRISMA_SECRET

/*
  @param {Object} user - user info pulled from database

  Creates a token storing user id and email. Expires in 12 hours
*/
function generateToken(user) {
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
  @param {Object} context - Contains request object

  Gets user ID from token stored in the authorization header. If there is no token or 
  if it is expired, it will throw an error.

  @return {ID} userId - User ID stored in token
*/
function getUserId({ request }) {
  const authorization = request.get('Authorization')
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const { id: userId } = jwt.verify(token, JWT_SECRET)
    return userId
  }
  throw new Error('Not Authenticated')
}

/*
  Checks the email stored in the token against the saved admin email in an .env file.
*/

function validToken(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return {
          token: "",
          valid: false
        }
      } else {
        return {
          token: generateToken(decoded),
          valid: true
        }
      }
    })
  }
  throw new Error('Not Authenticated')
}




export default {
  generateToken,
  getUserId,
  validToken
}
