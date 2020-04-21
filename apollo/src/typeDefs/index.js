import { query } from './query'
import { mutation } from './mutation'
import user from './user/'
import auth from './auth'

const schema = [query, mutation, ...user, ...auth]

export default schema
