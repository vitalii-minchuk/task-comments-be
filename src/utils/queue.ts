import { Queue } from 'bullmq';
import { Worker } from 'bullmq';

import {
  createFakeComments,
  createFakePost,
  createFakeUser,
} from '../modules/fake-data/fake-data.service';

const QUEUE_NAME = 'default';

const connection = {
  host: process.env.REDIS_HOST,
};

export const queue = new Queue(QUEUE_NAME, { connection });

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === 'generateFakeUser') {
      await createFakeUser();
    }

    if (job.name === 'generateFakePost') {
      await createFakePost();
    }
    if (job.name === 'generateFakeComments') {
      await createFakeComments();
    }
  },
  { connection },
);

type JobName = 'generateFakeUser' | 'generateFakePost' | 'generateFakeComments';

export const enqueue = async (job: JobName, data?: any) => {
  await queue.add(job, data);
};
