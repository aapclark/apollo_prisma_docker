import { gql } from 'apollo-server'


export const mutation = gql`
  type Mutation {
    root: String
  }
`
