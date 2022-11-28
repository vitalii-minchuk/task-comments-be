import 'reflect-metadata';
import createServer from './utils/create-server';

async function main() {
  const { app, server } = await createServer();

  app.get('/healthcheck', async () => 'OK');

  await server.start();

  await app.listen({
    port: 4004,
  });

  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

main();
