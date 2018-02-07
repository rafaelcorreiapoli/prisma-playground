import { GraphQLClient } from 'graphql-request'
import { exec } from 'child-process-promise'
import { createService } from '../src/service';
import * as ora from 'ora'

const spinner = ora()
const PRISMA_ENDPOINT="https://us1.prisma.sh/public-summergoose-25/entities-service/dev"
const PRISMA_SECRET="mysecret123"
const GRAPHQL_ENDPOINT = 'http://localhost:4000'
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJlbnRpdGllcy1zZXJ2aWNlQGRldiIsInJvbGVzIjpbImFkbWluIl19LCJpYXQiOjE1MTc5NzI4MDUsImV4cCI6MTUxODU3NzYwNX0.BHXiF3Ee_H6yQukkokFDE8BuMgqUa_pVdQ_gVHiuVys'

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: TOKEN,
  },
})

jest.setTimeout(20000)

interface IWorld {
  id?: string;
  anotherTechId?: string;
  projectId?: string;
  service?: {
    close: () => void;
  }
}

const world: IWorld = {}


const createTech = (name) => {
  const query = `
  mutation {
    createTechnology(input: {
      name: "${name}"
    }) {
      id
      name
    }
  } 
`
  return client.request(query)
}
describe('Technology flows', () => {
  beforeAll(async () => {
    spinner.start('Booting server')
    const server = createService({
      endpoint: PRISMA_ENDPOINT,
      secret: PRISMA_SECRET,
      debug: false
    })
    
    world.service = await server.start()
    spinner.succeed()
    spinner.start('Cleaning up database')
    await client.request(`
      mutation { clear }
    `)
    spinner.succeed()
  })

  afterAll(() => {
    world.service.close()
  })
  
  it ('creates a technology', async () => {
    const data: any = await createTech('My Technology')

    const id = data.createTechnology.id
    world.id = id

    expect(data).toEqual({
      createTechnology: {
        id,
        name: 'My Technology'
      }
    })
  })

  it('queries that technology', async () => {
    const query = `{
      technology(id: "${world.id}") {
        name
      }
    }`
      
    const data = await client.request(query)
    expect(data).toEqual({
      technology: {
        name: 'My Technology'
      }
    })
    console.log(data)
  })

  it ('creates another technology', async () => {
    const data: any = await createTech('Another Technology')
    world.anotherTechId = data.createTechnology.id
    expect(data).toEqual({
      createTechnology: {
        id: data.createTechnology.id,
        name: 'Another Technology'
      }
    })
  })

  it('queries all technologies', async () => {
    const query = `{
      technologies {
        name
      }
    }`

    const data = await client.request(query)
    expect(data).toEqual({
      technologies: [{
        name: 'My Technology'
      }, {
        name: 'Another Technology'
      }]
    })
  })

  it('updates a technology', async () => {
    const updateData = {
      name: 'My Technology Updated'
    }

    const query = `
      mutation updateTechnology($data: TechnologyUpdateInput!){
        updateTechnology(id: "${world.id}", data: $data) {
          id
          name
        }
      }
    `

    const data = await client.request(query, {
      data: updateData
    })
    expect(data).toEqual({
      updateTechnology: {
        id: world.id,
        name: 'My Technology Updated'
      }
    })
  })

  it ('creates a project', async () => {
    const query = `mutation {
      createProject(input: {
        name: "My Project"
      }) {
        id
        name
      }
    }`

    const data: any = await client.request(query)
    world.projectId = data.createProject.id

    expect(data).toEqual({
      createProject: {
        id: world.projectId,
        name: 'My Project'
      }
    })
  })

  it('links the project and the technology', async () => {
    const query = `mutation {
      connectProjectAndTechnology(input: {
        projectId: "${world.projectId}"
        technologyId: "${world.id}"
      }) {
        technology {
          id
        }
        project {
          id
        }
      }
    }`

    const data = await client.request(query)

    expect(data).toEqual({
      connectProjectAndTechnology: {
        technology: {
          id: world.id
        },
        project: {
          id: world.projectId
        }
      }
    })
  })

  it('should find the technology inside the project', async () => {
    const query = `{
      project(id: "${world.projectId}") {
        technologies {
          id
        }
      }
    }`

    const data = await client.request(query)

    expect(data).toEqual({
      project: {
        technologies: [{
          id: world.id
        }]
      }
    })
  })

  it('should find the project inside the technologyu', async () => {
    const query = `{
      technology(id: "${world.id}") {
        projects {
          id
        }
      }
    }`

    const data = await client.request(query)

    expect(data).toEqual({
      technology: {
        projects: [{
          id: world.projectId
        }]
      }
    })
  })

  it ('should add child technology to technology', async () => {
    const query = `mutation {
      connectTechnologyAndTechnology(input: {
        parentTechnologyId: "${world.id}"
        childTechnologyId: "${world.anotherTechId}"
      }) {
        id
      }
    }`

    const data = await client.request(query)
    expect(data).toEqual({
      connectTechnologyAndTechnology: {
        id: world.id,
      }
    })
  })

  it('In the child, should show the parent in parentTechnologies and show nothing in the childTechnologies', async () => {
    const query = `{
      technology(id: "${world.anotherTechId}") {
        id
        childTechnologies {
          id
        }
        parentTechnologies {
          id
        }
      }
    }`

    const data = await client.request(query)

    expect(data).toEqual({
      technology: {
        id: world.anotherTechId,
        childTechnologies: [],
        parentTechnologies: [{
          id: world.id
        }]
      }
    })
  })

  it ('In the parent, should show child in childTechnologies and show nothing in parentTechnologies', async () => {
    const query = `{
      technology(id: "${world.id}") {
        id
        childTechnologies {
          id
        }
        parentTechnologies {
          id
        }
      }
    }`

    const data = await client.request(query)

    expect(data).toEqual({
      technology: {
        id: world.id,
        childTechnologies: [{
          id: world.id
        }],
        parentTechnologies: []
      }
    })
  })
})