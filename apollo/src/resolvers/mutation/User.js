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
  const passwordMatch = await bcrypt.compare(password, user.password);
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

async function updateUser(_, args, { req, prisma }) {
  // console.log('update = = = = = req = = = = = ', req)
  const id = getUserId(req);
  res = await prisma.updateUser({
    data: { ...args },
    where: {
      id,
    },
  })

  return res
}

async function deleteUser(_, __, { req, prisma }) {
  // console.log('delete = = = = = req = = = = = ', req)

  const id = getUserId(req);
  return await prisma.deleteUser({ id });
}



export default {
  register,
  login,
  updateUser,
  deleteUser
}
