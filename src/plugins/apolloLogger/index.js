const apolloLogger = {
  requestDidStart({ request }) {
    const { query, http } = request
    const httpSymbols = Object.getOwnPropertySymbols(http)
    // creates object from 'Request internals' symbol in http obj -- this is quite sizable when GraphQL playground is inspecting the Apollo Server
    const requestInternals = http[httpSymbols[1]]
    // builds date and string
    const now = new Date()
    const date = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

    const info = `${requestInternals.method} --  ${date}`
    console.log('==========', info, '==========')
    return {
      parsingDidStart(ctx) {
        console.log('Parsing Started')
      },
      validationDidStart(ctx) {
        console.log('Validation started.')
      }
    }
  }
}

export default apolloLogger
