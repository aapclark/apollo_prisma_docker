//  Mutations for User management
import bcrypt from 'bcryptjs'
import { generateToken, getUserId } from '../../auth'

async function register(_, { input }, { prisma }) {
  // Checks if email is taken before proceeding
  const { email, password } = input
  const emailTaken = await prisma.$exists.user({
    email
  })

  if (!emailTaken) {
    const hash = bcrypt.hashSync(password, 10);
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
  else {
    throw new Error('Email address is already in use.')
  }
}

async function login(_, { input }, { prisma }) {
  const { email, password } = input
  const user = await prisma.user({ email });
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!user || !passwordMatch) {
    throw new Error('Invalid Login.');
  }
  else {
    const token = generateToken(user);
    return {
      token,
      user,
    };
  }
}

async function updateUser(_, args, { prisma }) {
  const id = getUserId(context);
  res = await prisma.updateUser({
    data: { ...args },
    where: {
      id,
    },
  })

  return res
}

async function deleteUser(_, __, { request, prisma }) {
  const id = getUserId(request);
  return await prisma.deleteUser({ id });
}

export default {
  register,
  login,
  updateUser,
  deleteUser
}
