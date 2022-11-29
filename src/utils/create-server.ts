import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { buildSchema } from 'type-graphql';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

import UserResolver from '../modules/user/user.resolver';
import fastifyJwt from '@fastify/jwt';

const app = fastify();

app.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (
      !origin ||
      ['http://localhost:3000', 'https://studio.apollographql.com'].includes(
        origin,
      )
    ) {
      return cb(null, true);
    }

    return cb(new Error('Not allowed'), false);
  },
});

app.register(fastifyCookie, {
  parseOptions: {},
});

app.register(fastifyJwt, {
  secret: 'change-me',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

async function buildContext(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await request.jwtVerify();

    return { request, reply, user };
  } catch (error) {
    return { request, reply, user: null };
  }
}

export type Context = Awaited<ReturnType<typeof buildContext>>;

async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({
        httpServer: app.server,
      }),
    ],
    context: buildContext,
  });

  return { app, server };
}

export default createServer;
