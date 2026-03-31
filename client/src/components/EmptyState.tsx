import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 md:py-24"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
          <div className="relative flex items-center justify-center w-full h-full bg-card rounded-full border border-border">
            <Inbox className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-center max-w-md"
      >
        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">No topics yet</h3>
        <p className="text-muted-foreground font-light mb-6">
          Add your first learning topic with hours and YouTube links.
        </p>
        <Button onClick={onAddTask} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
          Add Your First Topic
        </Button>
      </motion.div>
    </motion.div>
  );
}
