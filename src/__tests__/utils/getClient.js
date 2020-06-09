import ApolloClient from 'apollo-boost'

const uri = `http://localhost:${process.env.APOLLO_TEST_PORT}`


export const getClient = () => {
  return new ApolloClient({
    uri,
    onError: (e) => { console.log(e) }
  })
}

export const getAuthenticatedClient = (token) => {
  return new ApolloClient({
    uri,
    request: (operation) => {
      if (token) {
        operation.setContext({
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      }
    },
    onError: (e) => { console.log(e) }
  })
}
