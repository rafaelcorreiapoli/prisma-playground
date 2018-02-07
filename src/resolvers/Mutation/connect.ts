import { getUserId, Context } from '../../utils'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export const connect = {
  async connectProjectAndTechnology(parent, { input: { projectId, technologyId } }, ctx: Context, info) {
    const technology = await ctx.db.mutation.updateTechnology({
      where: {
        id: technologyId
      },
      data: {
        projects: {
          connect: {
            id: projectId
          }
        }
      }
    })

    const project = await ctx.db.query.project({
      where: {
        id: projectId
      }
    })

    return {
      technology,
      project
    }
  },
  async connectTechnologyAndTechnology(parent, { input: { parentTechnologyId, childTechnologyId }}, ctx: Context, info) {
    const parentTechnology = await ctx.db.mutation.updateTechnology({
      where: {
        id: parentTechnologyId
      },
      data: {
        childTechnologies: {
          connect: {
            id: childTechnologyId
          }
        }
      }
    })

    return parentTechnology
  }
}
