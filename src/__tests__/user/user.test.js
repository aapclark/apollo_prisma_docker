import { prisma } from '../../generated/prisma-client'
import { getClient, getAuthenticatedClient } from '../utils/getClient'
import { registerUser, updateUserInfo, updateUserPassword, login, deleteUser } from '../queries'

const client = getClient()


beforeAll(async () => {
  await prisma.deleteManyUsers()
})

describe('User registration tests', () => {
  const input = {
    email: 'test_user2@mail.com',
    password: 'much_security'
  }
  // * Password-length test
  it('Should throw error for insufficient password.', async () => {

    await expect(client.mutate({
      mutation: registerUser,
      variables: {
        email: 'test_user@mail.com',
        password: 'no'
      }
    })).rejects.toThrow(`GraphQL error: Password must be at least 8 characters.`)
  })
  // * Successful registration test
  it('Should successfully create a new user from registerUser mutation', async () => {

    await client.mutate({
      mutation: registerUser,
      variables: { ...input }
    })

    expect(await prisma.$exists.user({ email: input.email })).toBe(true)
  })

  // * Already-used email test
  it('Should throw error when email is taken.', async () => {

    await expect(client.mutate({
      mutation: registerUser,
      variables: { ...input }
    })).rejects.toThrow('GraphQL error: Email already in use.')

  })
})

describe('User update tests', () => {
  const input = {
    email: 'test_user3@mail.com',
    password: 'much_security_3'
  }


  it('Should reflect changes to user email in db', async () => {

    const { data } = await client.mutate({
      mutation: registerUser,
      variables: { ...input }
    })
    const { register: { token, user: { id } } } = data
    const authenticatedClient = await getAuthenticatedClient(token)

    const newUserInfo = {
      email: 'updated_user3@mail.com'
    }


    await authenticatedClient.mutate({
      mutation: updateUserInfo,
      variables: { ...newUserInfo }
    })

    const user = await prisma.user({ id })

    expect(user.email).toBe(newUserInfo.email)
  })

  it('Should accept updated password', async () => {
    const credentials = {
      email: 'updated_user3@mail.com',
      password: "much_security_3"
    }
    const {data} = await client.mutate({
    mutation: login,
    variables: {
      ...credentials
      }
    })
    const { login: { token, user: { id } } } = data
    const authenticatedClient = await getAuthenticatedClient(token)
    const newUserInfo = {
      password: 'new_nifty_password'
    }
    await authenticatedClient.mutate({
      mutation: updateUserPassword,
      variables: {...newUserInfo}
    })
    await client.mutate({
      mutation: login,
      variables: {
      email: credentials.email,
      ...newUserInfo
      }
    }) 
   
  })
})


describe('User authorization tests', () => {
  const input = {
    email: 'test_user2@mail.com',
    password: 'much_security'
  }

  it('Should reject a request that does not provide proper authentication.', async () => {
    await expect(client.mutate({
      mutation: updateUserInfo,
      variables: {
        email: 'rejected_email@mail.com',
        password: 'rejected_password'
      }
    })).rejects.toThrow('GraphQL error: Not Authenticated.')

  })

  it('Should return a token when user logs in', async () => {
    const { data } = await client.mutate({
      mutation: login,
      variables: { ...input }
    })

    expect(data.login).toHaveProperty('token')
  })

  it('Should remove user from db', async () => {
    const { data } = await client.mutate({
      mutation: login,
      variables: { ...input }
    })

    const { login: { token } } = data
    const authenticatedClient = await getAuthenticatedClient(token)
    const deletedUser = await authenticatedClient.mutate({
      mutation: deleteUser
    })
    const { data: { deleteUser: { id } } } = deletedUser
    const userExists = await prisma.$exists.user({ id })

    expect(userExists).toBe(false)
  })

})
