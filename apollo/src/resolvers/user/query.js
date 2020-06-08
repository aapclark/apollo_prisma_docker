const Query = {
  users: async function (_, args, { prisma }, __) {
    console.log('prisma', prisma)
    return await prisma.user.findMany()

  }
}

export default Query
