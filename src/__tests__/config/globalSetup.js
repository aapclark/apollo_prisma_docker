import server from '../../server'

const options = {
  port: process.env.APOLLO_TEST_PORT
}


const globalSetup = async () => {
  console.log(`Starting test server on port ${options.port}`)
  global.httpServer = server
  await global.httpServer.listen(options)

}

export default globalSetup
