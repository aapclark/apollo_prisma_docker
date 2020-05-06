// new approach: piece together each sub directory and export under resolvers
import authResolvers from './auth'
import userResolvers from './user'

const resolvers = [authResolvers, userResolvers]

export default resolvers
