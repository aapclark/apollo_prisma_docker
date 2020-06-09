// new approach: piece together each sub directory and export under resolvers
import authResolvers from './auth'
import userResolvers from './user'
import generalResolvers from './general'

const resolvers = [authResolvers, userResolvers, generalResolvers]

export default resolvers
