import { Context } from '../../utils'

export const clear = {
  async clear(parent, { input }, ctx: Context, info) {
    try {
      await ctx.db.mutation.deleteManyTechnologies({
        where: {}
      })
      await ctx.db.mutation.deleteManyProjects({
        where: {}
      })
      return true
    } catch (err) {
      return false
    }
  },
}
