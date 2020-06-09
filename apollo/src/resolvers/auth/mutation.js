import bcrypt from 'bcryptjs'
import { generateToken, hashPassword } from '../../auth'
import { AuthenticationError, UserInputError } from 'apollo-server'

const Mutation = {
	async register(_, { input }, { prisma },) {
		const { email, password } = input
		const emailTaken = await prisma.user.count({
			where: {
				email: email
			}
		})

		if (emailTaken) {
			throw new UserInputError('Email already in use.')
		}

		else {
			const hash = hashPassword(password)
			const user = await prisma.user.create({
				data: {
					email,
					password: hash
				}
			})
			const token = generateToken(user)

			return {
				token,
				user
			}
		}
	},

	async login(_, { input }, { prisma }) {
		const { email, password } = input
		const user = await prisma.user.findOne({
			where: {
				email: email
			}
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
