import type { Job } from 'bullmq';
import { Queue, Worker } from 'bullmq';

type TeamActivity = { activityId: string };
const connection = { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) };
const QUEUE_NAME = 'sendTeamActivityInviteQueue';
const OPTS = { removeOnComplete: true, removeOnFail: true };

const sendTeamActivityInviteQueue = new Queue(QUEUE_NAME, { connection });

const worker = new Worker(
  QUEUE_NAME,
  async ({ data: { activityId } }: Job<TeamActivity>) => {
    console.log('Processing teamActivity: ' + activityId);
    return activityId;
  },
  { connection }
);

worker.on('completed', (job: Job<TeamActivity>, returnValue: string) => {
  console.log('Job completed with return value: ' + returnValue);
});

export function sendEmailInvites(activityId: string) {
  sendTeamActivityInviteQueue.add(QUEUE_NAME, { activityId }, OPTS);
}
