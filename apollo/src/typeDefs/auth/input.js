import { gql } from 'apollo-server'


const inputDef = gql`
  input LoginInput {
		email: String!
		password: String!
	}

`

export default inputDef
