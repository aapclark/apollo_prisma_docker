import { gql } from 'apollo-server'


const mutationDef = gql`
  extend type Mutation {
    login(
      input: LoginInput!
    ): AuthPayload!
  } 

`


export default mutationDef
