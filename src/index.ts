import 'reflect-metadata';

import createServer from './utils/create-server';
import logger from './helpers/logger';
import { connectDB } from './utils/prisma';

async function main() {
  const { app, server } = await createServer();

  await server.start();

  app.get('/healthcheck', async () => 'OK');

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

  logger.info(`Server ready at http://localhost:${4004}${server.graphqlPath}`);
}

main().catch((e) => logger.info(e));
