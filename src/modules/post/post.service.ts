import { prisma } from '../../utils/prisma';
import { CreatePostInput } from './post.dto';
import { User } from '../user/user.dto';

export async function createPost(input: CreatePostInput, authorId: User['id']) {
  const post = await prisma.post.create({
    data: {
      text: input.text,
      userId: authorId,
      link: input.link,
    },
  });

  return post;
}
