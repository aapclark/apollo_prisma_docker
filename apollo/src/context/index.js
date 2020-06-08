import { PrismaClient } from '@prisma/client'

// This Context creator assumes validation is handle within resolvers. Consult Apollo Documents for alternative options.
const prisma = new PrismaClient()
console.log(prisma)
const createContext = async ({ req }) => {

  return { req, prisma }
}

export default createContext
