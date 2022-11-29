import 'reflect-metadata';
import createServer from './utils/create-server';
import { connectDB, prisma } from './utils/prisma';

async function main() {
  const { app, server } = await createServer();

  app.get('/healthcheck', async () => 'OK');

  app.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    console.log(users);
    res.send(users);
  });

  await server.start();

  app.register(
    server.createHandler({
      cors: false,
    }),
  );
  await connectDB();
  await app.listen({
    port: 4004,
    host: '0.0.0.0',
  });

  console.log(`Server ready at http://localhost:${4004}${server.graphqlPath}`);
}

main();
