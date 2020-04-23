import { gql } from 'apollo-boost'
import { prisma } from '../../generated/prisma-client'
import { getClient, getAuthenticatedClient } from '../utils/getClient'

const client = getClient()
let authenticatedClient


const registerUser = gql`
  mutation register($email: String!, $password: String!) { 
    register (
      input: {
        email: $email
        password: $password
      }
    ) {
      token
      user {
        id
      }
    }
  }
  `
const updateUser = gql`
  mutation updateUser($email: String, $password: String) {
    updateUser(
      input: {
        email: $email
        password: $password
      }
    ) {
      id
      email
    } 
    
  }
`

const login = gql`
  mutation login(
    $email: String!, 
    $password: String!) {
      login(
        input: {
          email: $email,
          password: $password
        }
    ) {
      token
      user {
        id
        email
      }
    }
  }
`


const deleteUser = gql`
    mutation {
      deleteUser {
        id
      }
    }
  `

beforeAll(async () => {
  await prisma.deleteManyUsers()

})


describe('User registration tests', () => {
  const input = {
    email: 'test_user2@mail.com',
    password: 'much_security'
  }
  it('Should throw error for insufficient password.', async () => {
    // const user = prisma.$exists(newUser.data.register.id)

    await expect(client.mutate({
      mutation: registerUser,
      variables: {
        email: 'test_user@mail.com',
        password: 'no'
      }
    })).rejects.toThrowError('Password must be at least 8 characters.')
  })

  it('Should successfully create a new user from registerUser mutation', async () => {

    await client.mutate({
      mutation: registerUser,
      variables: { ...input }
    })

    expect(await prisma.$exists.user({ email: input.email })).toBe(true)
  })

  it('Should throw error when email is taken.', async () => {
    expect(await client.mutate({
      mutation: registerUser,
      variables: { ...input }
    })).toThrowError('Email address is already in use.')

  })
})

// TODO -- update needs auth'd client
// describe('User update tests', () => {
//   const input = {
//     email: 'new_email@test.co',
//     password: 'more_secure_password'
//   }


//   it('Should reflect changes to user data in db', async () => {
//     await client.mutate({
//       mutation: updateUser,
//       variables: { ...input }
//     })

//     expect(await prisma.$exists.user({ email: input.email })).toBe(true)
//   })

// })


describe('User authorization tests', () => {

  const input = {
    email: 'test_user2@mail.com',
    password: 'much_security'
  }

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

    console.log('userExists', userExists)

    expect(userExists).toBe(false)

  })

})
