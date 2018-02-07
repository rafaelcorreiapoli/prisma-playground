import { Query } from './Query'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { technology } from './Mutation/technology';
import { AuthPayload } from './AuthPayload'
import { clear } from './Mutation/clear';
import { project } from './Mutation/project'
import { connect } from './Mutation/connect'
import { Technology } from './Technology'

export default {
  Query,
  Mutation: {
    ...auth,
    ...technology,
    ...clear,
    ...project,
    ...connect
  },
  AuthPayload,
  // Technology,
}
