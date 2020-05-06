import { getUserId, hashPassword } from '../../auth'
import { UserInputError } from 'apollo-server'

const Mutation = {
	updateUserInfo: async function(_, { input }, { req, prisma }){
		const id = getUserId(req)
		const { email } = input
		const updates = {}
		if (email) {
			const emailTaken = await prisma.$exists.user({
			email
			})
			if (emailTaken) {
				throw new UserInputError('Email already in use.')
			} else {
				updates["email"] = email
				}
			}
		
		console.log('UpdateUser -- updates object', updates)
		const res = await prisma.updateUser({
			data: {...updates},
			where: {
				id
			}
		})
		return res
	}, 
	updateUserPassword: async function(_, { input }, { req, prisma }) {
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
	deleteUser: async function(_, __, { req, prisma }) {
		const id = getUserId(req)
		return await prisma.deleteUser({id})
	}
}

export default Mutation
