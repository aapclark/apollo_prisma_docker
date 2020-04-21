import { gql } from 'apollo-server'

const inputDefs = gql`
  input RegistrationInput {
		email: String!
		password: String!
	}

	input UpdateUserInput {
		email: String
		password: String
	}
`

export default inputDefs
