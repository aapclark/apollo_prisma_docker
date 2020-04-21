import { gql } from 'apollo-server'

const mutationDefs = gql`
  extend type Mutation {
		register(
			input: RegistrationInput!
			): AuthPayload!
		updateUser (
			input: UpdateUserInput
			): User!
		deleteUser: User!
  }
`

export default mutationDefs
