import { Context } from '../../utils'

export const project = {
  async createProject(parent, { input }, ctx: Context, info) {
    const project = await ctx.db.mutation.createProject({
      data: input,
    })

    return project
  },

  async updateProject(parent, { id, data }, ctx: Context, info) {
    const project = await ctx.db.query.project({ where: { id } })
    if (!project) {
      throw new Error(`No such project found for id: ${id}`)
    }
    const updatedProject = await ctx.db.mutation.updateProject({
      data,
      where: {
        id
      }
    })
    return updatedProject
  },
}
