import { faker } from '@faker-js/faker';
import _random from 'lodash.random';

import { prisma } from '../../utils/prisma';

export async function createFakeUser() {
  const result = await prisma.user.create({
    data: {
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      username: faker.name.firstName(),
      password: 'Test123',
    },
  });

  return result;
}

export async function createFakePost() {
  const chance = faker.helpers.maybe(() => true, { probability: 0.3 });
  const users = await prisma.user.findMany();
  const randomUser = _random(0, users.length);
  const randomImage = chance ? faker.image.avatar() : '';

  const result = await prisma.post.create({
    data: {
      text: faker.lorem.paragraph(_random(1, 4)),
      image_url: randomImage,
      user: {
        connect: {
          id: users[randomUser].id,
        },
      },
    },
  });

  return result;
}

export async function createFakeComments() {
  const chance = faker.helpers.maybe(() => true, { probability: 0.3 });
  const users = await prisma.user.findMany();
  const randomUser = _random(0, users.length);
  const randomImage = chance ? faker.image.avatar() : '';
  const posts = await prisma.post.findMany();
  const randomPost = _random(0, posts.length);

  const result = await prisma.comment.create({
    data: {
      text: faker.lorem.paragraph(_random(1, 4)),
      image_url: randomImage,
      post: { connect: { id: posts[randomPost].id } },
      user: {
        connect: {
          id: users[randomUser].id,
        },
      },
    },
  });

  return result;
}

export async function removeData() {
  const result = await prisma.post.deleteMany({});

  return result;
}
