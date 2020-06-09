const Query = {
  async users(_, _, { prisma }, ____) {
    return await prisma.user.findMany()
  }
}

export default Query
