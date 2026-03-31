import { motion } from 'framer-motion';
  import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assests/logo.png';

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container py-3 md:py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <img src={logo} alt="Task Manager Logo" className="h-12 w-12 sm:h-20 sm:w-20 rounded-md object-contain" />
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black text-foreground">Task Manager</h1>
                <p className="text-sm font-light text-muted-foreground tracking-wide">Track topics, hours, and YouTube links</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Button
              onClick={onAddTask}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-soft"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Topic</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
