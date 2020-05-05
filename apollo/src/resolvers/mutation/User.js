//  Mutations for User management
import bcrypt from 'bcryptjs'
import { generateToken, getUserId, hashPassword } from '../../auth'
import { AuthenticationError, UserInputError } from 'apollo-server'


async function register(_, { input }, { prisma }) {
  // Checks if email is taken before proceeding
  const { email, password } = input
  const emailTaken = await prisma.$exists.user({
    email
  })

  if (emailTaken) {
    throw new UserInputError('Email already in use.')
  }

  else {
    const hash = hashPassword(password)
    const user = await prisma.createUser({
      email,
      password: hash
    });
    const token = generateToken(user);
    return {
      token,
      user,
    }
  }

}

async function login(_, { input }, { prisma }) {
  const { email, password } = input
  const user = await prisma.user({ email });
  let passwordMatch
  user && (passwordMatch = await bcrypt.compare(password, user.password))
  if (!user || !passwordMatch) {
    throw new AuthenticationError('Invalid Login.');
  }
  else {
    const token = generateToken(user);
    return {
      token,
      user,
    };
  }
}

async function updateUserPassword(_, {input},{req, prisma}) {
  const id = getUserId(req)
  const {password} = input
  
  const hash = hashPassword(password)
  const res = prisma.updateUser({
  data: {password: hash},
  where: {id}
  })
  return res
}

async function updateUserInfo(_, { input }, { req, prisma }) {
  const id = getUserId(req);
  const { email, password } = input
  const updates = {}
  if (email) {
    const emailTaken = await prisma.$exists.user({
      email
    })
    if (emailTaken) {
      throw new UserInputError('Email already in use.')
    }
    else {
      updates["email"] = email
    }
  }

  const res = await prisma.updateUser({
    data: { ...updates },
    where: {
      id,
    },
  })

  return res
}

async function deleteUser(_, __, { req, prisma }) {
  const id = getUserId(req);
  return await prisma.deleteUser({ id });
}



export default {
  register,
  login,
  updateUserPassword,
  updateUserInfo,
  deleteUser
}
