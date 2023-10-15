import type { Job } from 'bullmq';
import { Queue, Worker } from 'bullmq';

type EmailJob = { email: string; activityId: string };
const connection = { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) };
const QUEUE_NAME = 'emailActivityInviteQueue';
const OPTS = { removeOnComplete: true, removeOnFail: true };

const emailActivityInviteQueue = new Queue(QUEUE_NAME, { connection });

const worker = new Worker(
  QUEUE_NAME,
  async ({ data: { email, activityId } }: Job<EmailJob>) => {
    console.log('Processing teamActivity: ' + activityId);
    console.log('sending email to ' + email);
    return activityId;
  },
  { connection }
);

worker.on('completed', (job: Job<EmailJob>, returnValue: string) => {
  console.log('Job completed with return value: ' + returnValue);
});

export async function sendEmailInvites(emailJob: EmailJob) {
  await emailActivityInviteQueue.add(QUEUE_NAME, { ...emailJob }, OPTS);
}
