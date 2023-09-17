import crypto from 'crypto';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tw-merge';

export type Clientify<T> = Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string };

export function getStringInitials(clubName: string): string {
  const words = clubName.split(' ');
  const initials = words.map(word => word[0]).join('');
  return initials.toUpperCase();
}

export function getColorForString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 75%)`;
}

export function getDataUrl(buffer: Buffer) {
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
}

export function getGravatarUrl(email: string) {
  const emailHash = md5(email);
  return `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
}

export function md5(data: string) {
  return crypto.createHash('md5').update(data).digest('hex');
}

export function getMessageOrDefault(error: any, defaultMessage: string): string {
  if (typeof error === 'string') {
    return error;
  } else if (error instanceof Error) {
    return error.message || defaultMessage;
  } else {
    return defaultMessage;
  }
}

export function cx(...args: any[]) {
  return args
    .flat()
    .filter(x => typeof x === 'string')
    .join(' ')
    .trim();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
