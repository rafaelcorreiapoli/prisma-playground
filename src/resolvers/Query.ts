import { getUserId, Context } from '../utils'

export const Query = {
  technology(parent, args, ctx: Context, info) {
    return ctx.db.query.technology({ where: { id: args.id } }, info)
  },
  project(parent, args, ctx: Context, info) {
    return ctx.db.query.project({ where: { id: args.id } }, info)
  },
  technologies(parent, args, ctx: Context, info) {
    return ctx.db.query.technologies({where: {}}, info)
  },
  projects(parent, args, ctx: Context, info) {
    return ctx.db.query.projects({where: {}}, info)
  },
}
