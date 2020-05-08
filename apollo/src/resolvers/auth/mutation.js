import bcrypt from 'bcryptjs'
import { generateToken, hashPassword } from '../../auth'
import { AuthenticationError, UserInputError } from 'apollo-server'

const Mutation = {
	register: async function (_, { input }, { prisma }) {
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
			})
			const token = generateToken(user)

			return {
				token,
				user
			}
		}
	},

	login: async function (_, { input }, { prisma }) {
		const { email, password } = input
		const user = await prisma.user({
			email
		})
		let passwordMatch
		user && (passwordMatch = await bcrypt.compare(password, user.password))
		if (!user || !passwordMatch) {
			throw new AuthenticationError('Invalid Login.')
		} else {
			const token = generateToken(user)
			return {
				token,
				user
			}
		}
	}
}

export default Mutation
