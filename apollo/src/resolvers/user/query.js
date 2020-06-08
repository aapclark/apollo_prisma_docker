const Query = {
  users: async function (_, args, { prisma }, __) {
    return await prisma.user.findMany()

  }
}

export default Query
