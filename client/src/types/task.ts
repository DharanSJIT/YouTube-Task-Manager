export interface Task {
  id: string;
  topic: string;
  durationHours: number;
  youtubeUrls: string[];
  youtubeVideoIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  topic: string;
  durationHours: number;
  youtubeUrls: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYoutubeThumbnail(videoId: string | undefined): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  if (hours === 1) {
    return '1h';
  }
  return `${hours}h`;
}
