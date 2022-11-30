import { ApolloError } from 'apollo-server-core';
import { Arg, Ctx, Mutation } from 'type-graphql';
import logger from '../../helpers/logger';
import { Context } from '../../utils/create-server';
import { Comment, CreateCommentInput } from './comment.dto';
import { createComment } from './comment.service';

class CommentResolver {
  @Mutation(() => Comment)
  async createNewComment(
    @Arg('input') input: CreateCommentInput,
    @Ctx() context: Context,
  ) {
    try {
      logger.info(context.user);
      logger.info(input);
      if (!context.user) {
        throw new ApolloError('Author does not exist');
      }
      const authorId = context.user.id;
      const comment = await createComment(input, authorId);

      return comment;
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default CommentResolver;
