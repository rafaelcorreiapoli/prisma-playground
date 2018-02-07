import { createService } from './service';


const server = createService({
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
  secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
})
server.start(() => console.log(`Server is running on http://localhost:4000`))

