import { prisma } from '../../utils/prisma';
import { CreatePostInput } from './post.dto';
import { User } from '../user/user.dto';

export async function createPost(input: CreatePostInput, authorId: User['id']) {
  const post = await prisma.post.create({
    data: {
      text: input.text,
      link: input.link,
      user: {
        connect: {
          id: authorId,
        },
      },
    },
  });

  return post;
}

export async function findAllPosts() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      createdAt: true,
      text: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return posts;
}
