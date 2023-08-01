import { streamMultipart } from '@web3-storage/multipart-parser';
import type { FileUploader } from '~/s3-utils';

const IMAGE_PATTERN = /image\//;

export async function parseAndProcessFormData(request: Request, uploadHandler: FileUploader) {
  const contentType: string = request.headers.get('Content-Type') || '';
  const [type, boundary] = contentType.split(/\s*;\s*boundary=/);

  if (!request.body || !boundary || type !== 'multipart/form-data') {
    throw new Error('Could not parse content as FormData.');
  }

  const fileParts = streamMultipart(request.body, boundary);
  const urls: string[] = [];

  for await (let part of fileParts) {
    if (part.done) break;
    if (!IMAGE_PATTERN.test(part.contentType)) throw new Error('File must be an image');
    if (typeof part.filename === 'string') part.filename = part.filename.split(/[/\\]/).pop();

    const value = await uploadHandler(part);
    if (!value) throw new Error('Upload of image failed');

    urls.push(value);
  }

  return urls;
}
