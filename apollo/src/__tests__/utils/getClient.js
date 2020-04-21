import ApolloClient from 'apollo-boost'

// TODO -- update URI w/ env
export const getClient = (token) => {
  return new ApolloClient({
    uri: '',
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
