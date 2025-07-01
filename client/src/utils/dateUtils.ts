import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatMessageTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'dd/MM/yyyy');
  }
};

export const formatLastSeen = (date: Date): string => {
  if (isToday(date)) {
    return `last seen today at ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `last seen yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return `last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
  }
};

export const formatChatTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'dd/MM/yy');
  }
};