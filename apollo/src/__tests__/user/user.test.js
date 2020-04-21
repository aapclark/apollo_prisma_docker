import { gql } from 'apollo-boost'
import { prisma } from '../../generated/prisma-client'
import { getClient } from '../utils/getClient'

const client = getClient()



const registerUser = gql`
  mutation { 
    register (
      input: {
        first_name: "Testing"
        last_name: "User"
        email: "testing@test.com"
        password: "verySecure"
        city: "TestCity"
        state: "NM"
      }
    ) {
      token
      user {
        id
      }
    }
  }
  
  `

beforeAll(async () => {
  await prisma.deleteManyUsers()


  const authenticatedUser = await client.mutate({
    mutation: registerUser
  })

  authenticatedClient = getClient(authenticatedUser.data.registerUser.token)

  console.log(`auth'd user`, authenticatedUser)
})

// console.log('User testing >> authenticatedUser', authenticatedUser)

test('User tests', () => {
  it('Should display single recently created user.')
})
