import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'duration-asc' | 'duration-desc' | 'topic-asc' | 'topic-desc';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  taskCount: number;
}

export function FilterBar({ sortBy, onSortChange, taskCount }: FilterBarProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'duration-asc', label: 'Hours: Low to High' },
    { value: 'duration-desc', label: 'Hours: High to Low' },
    { value: 'topic-asc', label: 'Topic: A to Z' },
    { value: 'topic-desc', label: 'Topic: Z to A' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div className="text-sm font-light text-muted-foreground">
        {taskCount} topic{taskCount !== 1 ? 's' : ''} found
      </div>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none px-3 py-2 pr-8 rounded-lg bg-muted/50 text-muted-foreground border border-border hover:bg-muted transition-colors cursor-pointer font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </motion.div>
  );
}
