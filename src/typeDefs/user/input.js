import { gql } from 'apollo-server'

const inputDefs = gql`
  input RegistrationInput {
		email: String!
		password: String!
	}
	input UpdateUserPasswordInput {
		password: String!
	}
	input UpdateUserInfoInput {
		email: String
	}
`

export default inputDefs
