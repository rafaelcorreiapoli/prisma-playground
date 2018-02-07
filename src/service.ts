import { GraphQLServer } from '@rafa93br/graphql-yoga'
import { Prisma } from './generated/prisma'
import resolvers from './resolvers'

export const createService = ({
  endpoint,
  secret,
  debug = true
}) => new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint,
      secret,
      debug, // log all GraphQL queries & mutations
    }),
  }),
})