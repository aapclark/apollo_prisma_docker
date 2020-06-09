import { gql } from 'apollo-server'
const queryDef = gql`
extend type Query{
  users: [User!]
}
`


export default queryDef
