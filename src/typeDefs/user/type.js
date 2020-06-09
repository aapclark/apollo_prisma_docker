import { gql } from 'apollo-server'

const typeDef = gql`
 type User  {
		id: ID!
		email: String!
  }
`

export default typeDef
