import { motion } from 'framer-motion';
import { Edit2, Trash2, Clock, ExternalLink } from 'lucide-react';
import { Task, formatDuration, getYoutubeThumbnail } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export function TaskCard({ task, onEdit, onDelete, index = 0 }: TaskCardProps) {
  const hasYoutubeUrls = task.youtubeUrls && task.youtubeUrls.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative h-full bg-card rounded-xl border border-border shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-5 md:p-6 h-full flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground truncate">{task.topic}</h3>
          </div>

          {hasYoutubeUrls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 space-y-2"
            >
              {task.youtubeUrls.map((url, idx) => {
                const videoId = task.youtubeVideoIds[idx];
                const thumbnailUrl = getYoutubeThumbnail(videoId);

                if (!thumbnailUrl) return null;

                return (
                  <a
                    key={`${task.id}-${idx}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video bg-muted overflow-hidden rounded-lg border border-border group/thumb"
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`YouTube video ${idx + 1}`}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300" />
                    </div>
                  </a>
                );
              })}
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatDuration(task.durationHours)}</span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(task)}
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                title="Edit topic"
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Delete topic"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
