import server from '../../server'

const options = {
  port: (process.env.APOLLO_PORT || process.env.PORT_TEST) || 3232
}



const globalSetup = async () => {
  console.log('Starting test server.')
  global.httpServer = server
  await global.httpServer.listen(options)

}

export default globalSetup
