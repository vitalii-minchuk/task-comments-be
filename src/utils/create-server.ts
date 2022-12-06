import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { buildSchema } from 'type-graphql';

import { User } from '../modules/user/user.dto';
import CommentResolver from '../modules/comment/comment.resolver';
import PostResolver from '../modules/post/post.resolver';
import UserResolver from '../modules/user/user.resolver';
import FakeDataResolver from '../modules/fake-data/fake-data.resolver';
import { bearerAuthChecker } from './auth-checker';

const app = fastify();

app.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (
      !origin ||
      [
        'http://127.0.0.1:5173',
        'https://task-comments.netlify.app',
        'https://studio.apollographql.com',
      ].includes(origin)
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
type CtxUser = Omit<User, 'password'>;

async function buildContext({
  request,
  reply,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  try {
    const user = await request.jwtVerify<CtxUser>();

    return { request, reply, user };
  } catch (e) {
    return { request, reply, user: null };
  }
}

export type Context = Awaited<ReturnType<typeof buildContext>>;

async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver, CommentResolver, FakeDataResolver],
    authChecker: bearerAuthChecker,
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
