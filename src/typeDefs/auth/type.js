import { gql } from 'apollo-server'


const typeDef = gql`
  type AuthPayload {
    token: String!
    user: User!
  }
`


export default typeDef
