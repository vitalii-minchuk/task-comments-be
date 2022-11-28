import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';

import UserResolver from '../modules/user/user.resolver';

const app = fastify();

function buildContext() {
  console.log('first');
}

async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: app.server })],
    context: buildContext,
  });

  return { app, server };
}

export default createServer;
