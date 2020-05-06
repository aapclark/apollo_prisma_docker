import { gql } from 'apollo-server'

const mutationDefs = gql`
  extend type Mutation {
		register(
			input: RegistrationInput!
			): AuthPayload!
		updateUserPassword(
			input: UpdateUserPasswordInput!
		): User!
		updateUserInfo(
			input: UpdateUserInfoInput!
			): User!
		deleteUser: User!
  }
`

export default mutationDefs
