import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Task, CreateTaskInput, extractYoutubeVideoId } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TaskModalProps {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  isLoading?: boolean;
}

const DEFAULT_FORM: CreateTaskInput = {
  topic: '',
  durationHours: 1,
  youtubeUrls: [''],
};

export function TaskModal({ isOpen, task, onClose, onSubmit, isLoading = false }: TaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskInput>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (task) {
      const urls = task.youtubeUrls?.filter(Boolean) || [];
      setFormData({
        topic: task.topic,
        durationHours: task.durationHours,
        youtubeUrls: urls.length > 0 ? urls.slice(0, 2) : [''],
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setErrors({});
    setIsSubmitting(false);
  }, [task, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.classList.add('modal-open');
    return () => document.documentElement.classList.remove('modal-open');
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const firstUrl = formData.youtubeUrls[0]?.trim();

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic name is required';
    }

    if (!formData.durationHours || Number.isNaN(formData.durationHours) || formData.durationHours <= 0) {
      newErrors.durationHours = 'Learning hours must be greater than 0';
    }

    if (!firstUrl) {
      newErrors.youtubeUrl = 'YouTube link is required';
    } else if (!extractYoutubeVideoId(firstUrl)) {
      newErrors.youtubeUrl = 'Enter a valid YouTube link';
    }

    const secondUrl = formData.youtubeUrls[1]?.trim();
    if (secondUrl && !extractYoutubeVideoId(secondUrl)) {
      newErrors.additionalYoutubeUrl = 'Enter a valid additional YouTube link';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedUrls = formData.youtubeUrls.map((url) => url.trim()).filter(Boolean);
      await onSubmit({ ...formData, youtubeUrls: cleanedUrls });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAdditionalYoutubeUrl = () => {
    if (formData.youtubeUrls.length >= 2) return;
    setFormData((prev) => ({ ...prev, youtubeUrls: [...prev.youtubeUrls, ''] }));
  };

  const removeAdditionalYoutubeUrl = () => {
    setFormData((prev) => ({ ...prev, youtubeUrls: [prev.youtubeUrls[0] || ''] }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.additionalYoutubeUrl;
      return next;
    });
  };

  const updateYoutubeUrl = (index: number, value: string) => {
    const urls = [...formData.youtubeUrls];
    urls[index] = value;
    setFormData({ ...formData, youtubeUrls: urls });
  };

  const submitting = isSubmitting || isLoading;
  const hasAdditionalUrl = formData.youtubeUrls.length > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed top-0 left-0 w-screen h-[100dvh] bg-black/40 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-screen h-[100dvh] z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md max-h-[calc(100dvh-2rem)] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0">
                <h2 className="text-xl sm:text-2xl font-black text-foreground pr-3 leading-tight">
                  {task ? 'Edit Topic' : 'Add Learning Topic'}
                </h2>
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto overflow-x-hidden no-scrollbar flex-1">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="font-semibold text-foreground">
                    Topic Name
                  </Label>
                  <Input
                    id="topic"
                    type="text"
                    placeholder="e.g., React Hooks"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    disabled={submitting}
                    className={`rounded-lg ${errors.topic ? 'border-destructive' : ''}`}
                  />
                  {errors.topic && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {errors.topic}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="font-semibold text-foreground">
                    Learning Hours
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.durationHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationHours: Number.parseFloat(e.target.value),
                      })
                    }
                    disabled={submitting}
                    className={`rounded-lg ${errors.durationHours ? 'border-destructive' : ''}`}
                  />
                  {errors.durationHours && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {errors.durationHours}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube-url" className="font-semibold text-foreground">
                    YouTube Link
                  </Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.youtubeUrls[0] || ''}
                    onChange={(e) => updateYoutubeUrl(0, e.target.value)}
                    disabled={submitting}
                    className={`rounded-lg ${errors.youtubeUrl ? 'border-destructive' : ''}`}
                  />
                  {errors.youtubeUrl && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {errors.youtubeUrl}
                    </div>
                  )}
                </div>

                {hasAdditionalUrl && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="Additional YouTube link (optional)"
                        value={formData.youtubeUrls[1] || ''}
                        onChange={(e) => updateYoutubeUrl(1, e.target.value)}
                        disabled={submitting}
                        className={`rounded-lg flex-1 ${errors.additionalYoutubeUrl ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={removeAdditionalYoutubeUrl}
                        disabled={submitting}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                        title="Remove additional link"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {errors.additionalYoutubeUrl && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        {errors.additionalYoutubeUrl}
                      </div>
                    )}
                  </div>
                )}

                {!hasAdditionalUrl && (
                  <button
                    type="button"
                    onClick={addAdditionalYoutubeUrl}
                    disabled={submitting}
                    className="w-full py-2 px-3 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base text-center disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add One More YouTube Link (Optional)
                  </button>
                )}

                <div className="mt-6 pt-3 border-t border-border flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={submitting}
                    className="flex-1 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  >
                    {submitting ? 'Saving...' : task ? 'Update Topic' : 'Save Topic'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
