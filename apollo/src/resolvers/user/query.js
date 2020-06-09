const Query = {
  async users(_, __, { prisma },) {
    return await prisma.user.findMany()
  }
}

export default Query
