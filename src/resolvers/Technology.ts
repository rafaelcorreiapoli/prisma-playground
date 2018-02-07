import { Context } from '../utils'

export const Technology = {
  childTechnologies: async (parent, args, ctx: Context, info) => {
    console.log(parent)
    return ['teste']
    // return ctx.db.query.user({ where: { id } }, info)
  },
}
