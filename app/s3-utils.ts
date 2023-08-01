import { PassThrough, Readable } from 'stream';

import { writeAsyncIterableToWritable } from '@remix-run/node';
import AWS from 'aws-sdk';
import type { UploadHandlerPart } from '@remix-run/server-runtime/dist/formData';
import sharp from 'sharp';

export type FileUploader = (part: UploadHandlerPart) => Promise<string>;

const EU_NORTH_1 = 'eu-north-1';
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

if (!(AWS_ACCESS_KEY && AWS_SECRET_ACCESS_KEY && AWS_BUCKET_NAME)) {
  throw new Error(`Storage is missing required configuration.`);
}

export function createS3ResizeImageUploadHandler(folderPath: string): FileUploader {
  return async ({ filename, contentType, name, data }: UploadHandlerPart) => {
    const transformer = sharp()
      .resize({ width: 100, height: 100, fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ mozjpeg: true, quality: 80 });

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
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: EU_NORTH_1
  });
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
