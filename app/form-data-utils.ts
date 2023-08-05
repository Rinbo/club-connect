import { streamMultipart } from '@web3-storage/multipart-parser';
import type { FileUploader } from '~/s3-utils';

const IMAGE_PATTERN = /image\//;

/**
 * Parses request body asynchronously, and uploads image files to S3 using upload handler. Returns image urls in a
 * string array.
 */
export async function parseAndProcessImageFormData(request: Request, uploadHandler: FileUploader) {
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

/**
 * Parses request body asynchronously, and returns non-image files as text in a map mirroring
 * formData, and uploads image files to S3 using upload handler, and returns file urls in a
 * string array attacked the imageUrl key.
 */
export async function parseAndProcessFormData(request: Request, uploadHandler: FileUploader) {
  const contentType: string = request.headers.get('Content-Type') || '';
  const [type, boundary] = contentType.split(/\s*;\s*boundary=/);

  if (!request.body || !boundary || type !== 'multipart/form-data') {
    throw new Error('Could not parse content as FormData.');
  }

  const parts = streamMultipart(request.body, boundary);
  const map = new Map<string, any>();
  const imageUrls: string[] = [];

  for await (let part of parts) {
    if (part.done) break;
    if (part.name !== 'img') {
      const next = await part.data.next();
      map.set(part.name, new TextDecoder().decode(next.value));
    } else if (IMAGE_PATTERN.test(part.contentType)) {
      if (typeof part.filename === 'string') part.filename = part.filename.split(/[/\\]/).pop();
      const value = await uploadHandler(part);
      if (!value) throw new Error('Upload of image failed');

      imageUrls.push(value);
    }
  }

  map.set('imageUrls', imageUrls);

  return map;
}
