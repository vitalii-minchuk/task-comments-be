import { ApolloError } from 'apollo-server-core';
import { Arg, Ctx, Mutation, Query } from 'type-graphql';

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
      const user = await createUser(input);

      return user;
    } catch (error: any) {
      throw Error(error);
    }
  }

  @Mutation(() => String)
  async login(@Arg('input') input: LoginUserInput, @Ctx() context: Context) {
    try {
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
        email: user.email,
        username: user.username,
      });

      if (!token) {
        throw new ApolloError('Error signing token');
      }

      context.reply.setCookie('token', token, {
        domain: 'localhost',
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: false,
      });

      return token;
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default UserResolver;
