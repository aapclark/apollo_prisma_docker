import { ApolloServer } from 'apollo-server'


import createContext from './context'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import apolloLogger from './plugins/apolloLogger'


const server = new ApolloServer({
  formatError: (err) => { console.log('Server encountered an error:', err); return err },
  typeDefs,
  resolvers,
  context: createContext,
  plugins: [apolloLogger],
  cors: true,
  ssl: false,
});

export default server
