import { PassThrough, Readable } from 'stream';

import { writeAsyncIterableToWritable } from '@remix-run/node';
import AWS from 'aws-sdk';
import type { UploadHandlerPart } from '@remix-run/server-runtime/dist/formData';
import type { ResizeOptions } from 'sharp';
import sharp from 'sharp';

export type FileUploader = (part: UploadHandlerPart) => Promise<string>;

const EU_NORTH_1 = 'eu-north-1';
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

if (!(AWS_ACCESS_KEY && AWS_SECRET_ACCESS_KEY && AWS_BUCKET_NAME)) {
  throw new Error(`Storage is missing required configuration.`);
}

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  },
  region: EU_NORTH_1
});

export const createS3NewsItemKeyPath = (clubId: string, clubNewsItemId: string) => `clubs/${clubId}/club-news/${clubNewsItemId}`;
export const createS3TeamNewsItemKeyPath = (clubId: string, teamId: string, teamNewsItemId: string) =>
  `clubs/${clubId}/teams/${teamId}/team-news/${teamNewsItemId}`;

export function mapImageUrlsToS3ObjectKey(urls: string[]): string[] {
  return urls.map(url => decodeURIComponent(new URL(url).pathname.slice(1)));
}

export function createS3StandardImageUploadHandler(folderPath: string) {
  const resizeStrategy: ResizeOptions = { width: 840 };
  return createS3ResizeImageUploadHandler(folderPath, resizeStrategy);
}
export function createS3SquareImageUploadHandler(folderPath: string) {
  const resizeStrategy: ResizeOptions = { width: 100, height: 100, fit: 'cover', position: sharp.strategy.attention };
  return createS3ResizeImageUploadHandler(folderPath, resizeStrategy);
}

export async function deleteS3Objects(keys: string[]) {
  const params = {
    Bucket: AWS_BUCKET_NAME!,
    Delete: {
      Objects: keys.map(key => ({ Key: key }))
    }
  };

  try {
    await s3.deleteObjects(params).promise();
    console.info(`Files deleted successfully from ${AWS_BUCKET_NAME}`);
  } catch (error) {
    console.error(`S3 Delete error: ${error}`);
  }
}

export async function deleteS3Object(key: string) {
  console.log('KEY', key);

  const params = {
    Bucket: AWS_BUCKET_NAME!,
    Key: key
  };

  try {
    const obj = await s3.deleteObject(params).promise();
    console.log('DELETED', obj.DeleteMarker);
    console.info(`File deleted successfully from ${AWS_BUCKET_NAME}`);
  } catch (error) {
    console.error(`S3 Delete error: ${error}`);
  }
}

export async function deleteFolder(folder: string) {
  const listParams = {
    Bucket: AWS_BUCKET_NAME!,
    Prefix: folder
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (!listedObjects.Contents || listedObjects.Contents?.length === 0) return;

  const keys: string[] = [];

  for (const obj of listedObjects.Contents) {
    const { Key } = obj;
    if (Key) keys.push(Key);
  }

  const deleteParams = {
    Bucket: AWS_BUCKET_NAME!,
    Delete: { Objects: keys.map(key => ({ Key: key })) }
  };

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await deleteFolder(folder);
}

function createS3ResizeImageUploadHandler(folderPath: string, resizeStrategy: ResizeOptions): FileUploader {
  return async ({ filename, contentType, name, data }: UploadHandlerPart) => {
    const transformer = sharp().resize(resizeStrategy).jpeg({ mozjpeg: true, quality: 80 });

    const passThrough = new PassThrough();
    asyncIterableToStream(data).pipe(transformer).pipe(passThrough);

    return s3UploadHandler({ name, filename: `${folderPath}/${filename}`, data: passThrough, contentType });
  };
}

async function s3UploadHandler({ filename, data }: UploadHandlerPart): Promise<string> {
  return await uploadStreamToS3(data, filename!);
}

async function uploadStreamToS3(data: any, filename: string): Promise<string> {
  const stream = uploadStream({ Key: filename });
  await writeAsyncIterableToWritable(data, stream.writeStream);
  const file = await stream.promise;
  return file.Location;
}

const uploadStream = ({ Key }: Pick<AWS.S3.Types.PutObjectRequest, 'Key'>) => {
  const pass = new PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket: AWS_BUCKET_NAME, Key, Body: pass }).promise()
  };
};

function asyncIterableToStream(asyncIterable: AsyncIterable<Uint8Array>): Readable {
  const iterator = asyncIterable[Symbol.asyncIterator]();
  const readable = new Readable({
    async read() {
      const result = await iterator.next();
      if (result.done) {
        readable.push(null);
      } else {
        readable.push(result.value);
      }
    }
  });
  return readable;
}
