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
export const updateUser = gql`
  mutation updateUser($email: String, $password: String) {
    updateUser(
      input: {
        email: $email
        password: $password
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
