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

describe('User update tests', () => {
  const input = {
    email: 'new_email@test.co',
    password: 'more_secure_password'
  }


  it('Should reflect changes to user data in db', async () => {
    await client.mutate({
      mutation: updateUser,
      variables: { ...input }
    })

    expect(await prisma.$exists.user({ email: input.email })).toBe(true)
  })

})
