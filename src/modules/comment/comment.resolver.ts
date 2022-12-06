import { ApolloError } from 'apollo-server-core';
import sanitizeHtml from 'sanitize-html';
import { Arg, Authorized, Ctx, Mutation, Query } from 'type-graphql';

import { sanitizeHtmlOptions } from '../../constants';
import { Context } from '../../utils/create-server';
import {
  Comment,
  CreateCommentInput,
  GetPostCommentsInput,
} from './comment.dto';
import { createComment, findAllPostComments } from './comment.service';

class CommentResolver {
  @Query(() => [Comment])
  async getAllPostComments(@Arg('input') input: GetPostCommentsInput) {
    try {
      const comments = await findAllPostComments(input.postId);

      return comments;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw Error(error);
    }
  }

  @Authorized()
  @Mutation(() => Comment)
  async createNewComment(
    @Arg('input') input: CreateCommentInput,
    @Ctx() context: Context,
  ) {
    try {
      const cleanData = sanitizeHtml(input.text, sanitizeHtmlOptions);

      if (!cleanData) {
        throw new ApolloError('hello');
      }

      if (!context.user) {
        throw new ApolloError('Author does not exist');
      }
      const authorId = context.user.id;
      const comment = await createComment(input, authorId);

      return comment;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw Error(error);
    }
  }
}

export default CommentResolver;
