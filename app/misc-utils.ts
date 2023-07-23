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
