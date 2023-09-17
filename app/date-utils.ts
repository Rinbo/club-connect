import { format } from 'date-fns';

export function formatDate(stringDate: string) {
  return format(new Date(stringDate), 'yyyy-MM-dd');
}

export function formatTime(stringDate: string) {
  return format(new Date(stringDate), 'HH:mm');
}
