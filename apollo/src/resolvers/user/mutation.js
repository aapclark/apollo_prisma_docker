import { getUserId, hashPassword } from '../../auth'
import { UserInputError } from 'apollo-server'

const Mutation = {

	async updateUserInfo(_, { input }, { req, prisma }) {
		const id = getUserId(req)
		const { email } = input
		const updates = {}
		if (email) {
			const emailTaken = await prisma.user.count({
				where: {
					email
				}
			})
			if (emailTaken) {
				throw new UserInputError('Email already in use.')
			} else {
				updates["email"] = email
			}
		}

		const res = await prisma.user.update({
			data: { ...updates },
			where: {
				id
			}
		})
		return res
	},
	async updateUserPassword(_, { input }, { req, prisma }) {
		const id = getUserId(req)
		const { password } = input

		const hash = hashPassword(password)
		const res = prisma.updateUser({
			data: {
				password: hash
			},
			where: {
				id
			}
		})
		return res
	},
	async deleteUser(_, __, { req, prisma }) {
		const id = getUserId(req)
		return await prisma.user.delete({ id })
	}
}

export default Mutation
