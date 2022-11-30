import { ApolloError } from 'apollo-server-core';
import { Arg, Ctx, Mutation } from 'type-graphql';
import logger from '../../helpers/logger';
import { Context } from '../../utils/create-server';
import { CreatePostInput, Post } from './post.dto';
import { createPost } from './post.service';

class RostResolver {
  @Mutation(() => Post)
  async createNewPost(
    @Arg('input') input: CreatePostInput,
    @Ctx() context: Context,
  ) {
    try {
      logger.info(context.user);
      logger.info(input);
      if (!context.user) {
        throw new ApolloError('Author does not exist');
      }
      const authorId = context.user.id;
      const post = await createPost(input, authorId);

      return post;
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default RostResolver;
