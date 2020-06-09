const globalTeardown = async () => {
  await global.httpServer.stop()
  console.log('Stopping test server.')
}

export default globalTeardown
