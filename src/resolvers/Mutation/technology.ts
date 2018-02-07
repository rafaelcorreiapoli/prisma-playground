import { Context } from '../../utils'

export const technology = {
  async createTechnology(parent, { input }, ctx: Context, info) {
    const technology = await ctx.db.mutation.createTechnology({
      data: input,
    })

    return technology
  },

  async updateTechnology(parent, { id, data }, ctx: Context, info) {
    const technology = await ctx.db.query.technology({ where: { id } })
    if (!technology) {
      throw new Error(`No such technology found for id: ${id}`)
    }
    console.log("============================")
    console.log(data)
    const updatedTechnology = await ctx.db.mutation.updateTechnology({
      data,
      where: {
        id
      }
    })
    return updatedTechnology
  },
}
