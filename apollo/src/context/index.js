import { prisma } from '../generated/prisma-client'

// This Context creator assumes validation is handle within resolvers. Consult Apollo Documents for alternative options.
const createContext = async ({ req }) => {

  return { req, prisma }
}

export default createContext
