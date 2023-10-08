import type { Job } from 'bullmq';
import { Queue, Worker } from 'bullmq';
import { updateNotificationStatus } from '~/models/team-activity.server';
import { NotificationStatus } from '@prisma/client';

type TeamActivity = { activityId: string };
const connection = { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) };
const QUEUE_NAME = 'sendTeamActivityInviteQueue';
const OPTS = { removeOnComplete: true, removeOnFail: true };

const sendTeamActivityInviteQueue = new Queue(QUEUE_NAME, { connection });

const worker = new Worker(
  QUEUE_NAME,
  async ({ data: { activityId } }: Job<TeamActivity>) => {
    console.log('Processing teamActivity: ' + activityId);
    setTimeout(() => {
      console.log('Setting notification status to SENT');
      updateNotificationStatus(activityId, NotificationStatus.SENT);
    }, 2000);
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
