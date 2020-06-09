import { gql } from 'apollo-boost'


export const registerUser = gql`
  mutation register($email: String!, $password: String!) { 
    register (
      input: {
        email: $email
        password: $password
      }
    ) {
      token
      user {
        id
      }
    }
  }
  `
export const updateUserInfo = gql`
  mutation updateUserInfo(
      $email: String
      ) {
    updateUserInfo(
      input: {
        email: $email
      }
    ) {
      id
      email
    } 
    
  }
`

export const login = gql`
  mutation login(
    $email: String!, 
    $password: String!) {
      login(
        input: {
          email: $email,
          password: $password
        }
    ) {
      token
      user {
        id
        email
      }
    }
  }
`


export const deleteUser = gql`
    mutation {
      deleteUser {
        id
      }
    }
  `
  
export const updateUserPassword = gql`
  mutation updateUserPassword(
      $password: String!
      ){
    updateUserPassword(
      input: {
        password: $password
      }
    ) {
      id
      email
    }
  }
`
