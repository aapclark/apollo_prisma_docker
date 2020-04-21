//  Mutations for User management
import bcrypt from 'bcryptjs'
import { generateToken, getUserId } from '../../auth'

async function register(_, { input }, { prisma }) {
  // Checks if email is taken before proceeding
  const emailTaken = await prisma.$exists.user({
    email: input.email
  })

  if (!emailTaken) {
    const hash = bcrypt.hashSync(input.password, 10);
    input.password = hash;
    const user = await prisma.createUser({
      ...input
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

async function login(_parent, { email, password }, { prisma }) {
  const user = await prisma.user({ email });
  const token = generateToken(user);
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!user || !passwordMatch) {
    throw new Error('Invalid Login');
  }
  return {
    token,
    user,
  };
}

async function updateUser(_parent, args, { prisma }) {
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
