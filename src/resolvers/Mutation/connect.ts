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
        id: childTechnologyId
      },
      data: {
        parentTechnology: {
          connect: {
            id: parentTechnologyId
          }
        }
      }
    })
    console.log(parentTechnology)

    // const childTechnology  = await ctx.db.mutation.updateTechnology({
    //   where: {
    //     id: childTechnologyId
    //   },
    //   data: {
    //     parentTechnologies: {
    //       connect: {
    //         id: parentTechnologyId
    //       }
    //     }
    //   }
    // })
    return parentTechnology
    // await sleep(10000)
    // const updatedParentTechnology = await ctx.db.query.technology({
    //   where: {
    //     id: parentTechnologyId
    //   }
    // }, info)

    // console.log(updatedParentTechnology)
    // return {
    //   parentTechnology,
    //   updatedParentTechnology,
    // }
  }
}
