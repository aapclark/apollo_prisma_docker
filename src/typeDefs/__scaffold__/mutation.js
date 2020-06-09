import { gql } from 'apollo-server'

// ! Make plural where multiple mutations are contained
const mutationDef = gql`
  extend type Mutation {
    
  }
`

export default mutationDef
