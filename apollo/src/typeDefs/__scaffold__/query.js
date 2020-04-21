import { gql } from 'apollo-server'

// ! Make plural where multiple queries are contained
const queryDef = gql`
  extend type Query {
    
  }
`

export default queryDef
