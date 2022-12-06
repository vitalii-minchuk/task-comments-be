import { ApolloError } from 'apollo-server-core';
import { Arg, Ctx, Mutation, Query } from 'type-graphql';
import sanitizeHtml from 'sanitize-html';

import verifyPassword from '../../helpers/verify-password';
import { Context } from '../../utils/create-server';
import { LoginUserInput, RegisterUserInput, User } from './user.dto';
import { createUser, findUserByEmail } from './user.service';

class UserResolver {
  @Query(() => User)
  me(@Ctx() context: Context) {
    return context.user;
  }

  @Mutation(() => User)
  async registerUser(@Arg('input') input: RegisterUserInput) {
    try {
      for (const value of Object.values(input)) {
        const cleanData = sanitizeHtml(value);

        if (!cleanData) {
          throw new ApolloError('hello');
        }
      }

      const candidate = await findUserByEmail(input.email);

      if (candidate) {
        throw new ApolloError('Email is already taken');
      }

      const user = await createUser(input);

      return user;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw Error(error);
    }
  }

  @Mutation(() => String)
  async login(@Arg('input') input: LoginUserInput, @Ctx() context: Context) {
    try {
      for (const value of Object.values(input)) {
        const cleanData = sanitizeHtml(value);

        if (!cleanData) {
          throw new ApolloError('hello');
        }
      }

      const user = await findUserByEmail(input.email);

      if (!user) {
        throw new ApolloError('Invalid credentials');
      }

      const isValid = await verifyPassword({
        password: user.password,
        candidatePassword: input.password,
      });

      if (!isValid) {
        throw new ApolloError('Invalid credentials');
      }
      const token = await context.reply.jwtSign({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      if (!token) {
        throw new ApolloError('Error signing token');
      }

      context.reply?.setCookie('token', token, {
        domain: 'localhost',
        path: '/',
        secure: true,
        // domain: 'netlify.app',
        httpOnly: true,
        sameSite: 'none',
      });

      return token;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default UserResolver;
