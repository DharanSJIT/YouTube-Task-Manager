import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, CreateTaskInput, UpdateTaskInput, extractYoutubeVideoId } from '@/types/task';

const TASKS_COLLECTION = 'tasks';

function firestoreToTask(data: any, id: string): Task {
  const youtubeUrls = Array.isArray(data.youtubeUrls) ? data.youtubeUrls : [];
  const youtubeVideoIds = youtubeUrls
    .map((url: string) => extractYoutubeVideoId(url))
    .filter((videoId: string | null) => videoId !== null) as string[];

  return {
    id,
    topic: data.topic || '',
    durationHours: data.durationHours || 0,
    youtubeUrls,
    youtubeVideoIds,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  };
}

function taskToFirestore(task: Partial<Task> | CreateTaskInput) {
  const youtubeUrls = (task.youtubeUrls || []).filter((url: string) => url && url.trim());

  return {
    topic: task.topic || '',
    durationHours: task.durationHours || 0,
    youtubeUrls,
    updatedAt: Timestamp.now(),
  };
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const data = taskToFirestore(input);
  const createdAt = Timestamp.now();
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...data,
    createdAt,
  });

  return firestoreToTask({ ...data, createdAt }, docRef.id);
}

export async function getTasks(): Promise<Task[]> {
  const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((taskDoc) => firestoreToTask(taskDoc.data(), taskDoc.id));
}

export function subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
  const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map((taskDoc) => firestoreToTask(taskDoc.data(), taskDoc.id));
    callback(tasks);
  });
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const { id, ...updates } = input;
  const taskRef = doc(db, TASKS_COLLECTION, id);

  await updateDoc(taskRef, taskToFirestore(updates));

  const updatedData = {
    ...taskToFirestore(updates),
    ...updates,
  };

  return firestoreToTask(updatedData, id);
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, TASKS_COLLECTION, id));
}
