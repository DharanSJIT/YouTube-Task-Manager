import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { EmptyState } from '@/components/EmptyState';
import { FilterBar } from '@/components/FilterBar';
import { Task, CreateTaskInput } from '@/types/task';
import { createTask, getTasks, subscribeToTasks, updateTask, deleteTask } from '@/services/taskService';

type SortOption = 'newest' | 'oldest' | 'duration-asc' | 'duration-desc' | 'topic-asc' | 'topic-desc';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const initialTasks = await getTasks();
        setTasks(initialTasks);
      } catch (error) {
        console.error('Error loading topics:', error);
        toast.error('Failed to load topics');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();

    const unsubscribe = subscribeToTasks((updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task) => task.topic.toLowerCase().includes(query));
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'duration-asc':
        result.sort((a, b) => a.durationHours - b.durationHours);
        break;
      case 'duration-desc':
        result.sort((a, b) => b.durationHours - a.durationHours);
        break;
      case 'topic-asc':
        result.sort((a, b) => a.topic.localeCompare(b.topic));
        break;
      case 'topic-desc':
        result.sort((a, b) => b.topic.localeCompare(a.topic));
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, sortBy]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = async (data: CreateTaskInput) => {
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, ...data });
        toast.success('Topic updated successfully');
      } else {
        await createTask(data);
        toast.success('Topic added successfully');
      }
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error('Failed to save topic');
      throw error;
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success('Topic removed successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Failed to remove topic');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background overflow-x-hidden">
      <Header onAddTask={handleAddTask} />

      <main className="container py-6 md:py-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-32 -left-20 w-40 h-40 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-40 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-32 -right-20 w-52 h-52 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-full blur-3xl opacity-40 pointer-events-none"
        />

        <div className="relative space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {tasks.length > 0 && <FilterBar sortBy={sortBy} onSortChange={setSortBy} taskCount={filteredTasks.length} />}
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-card rounded-xl border border-border animate-pulse" />
              ))}
            </motion.div>
          ) : filteredTasks.length === 0 && tasks.length === 0 ? (
            <EmptyState onAddTask={handleAddTask} />
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <p className="text-lg text-muted-foreground font-light">No topics found for this search.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}
