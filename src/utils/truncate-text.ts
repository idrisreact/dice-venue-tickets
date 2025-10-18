export function truncateText(text: string, length: number): string {
  if (!text || text.length <= length) {
    return text;
  }

  const truncated = text.slice(0, length);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > length * 0.8) {
    return truncated.slice(0, lastSpaceIndex).trim() + '...';
  }

  return truncated.trim() + '...';
}