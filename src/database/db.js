import { openDB } from 'idb';

const DB_NAME = 'taskDatabase';
const STORE_NAME = 'tasks';

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
};

// Add a new task
export const addTaskToDB = async (task) => {
  const db = await initDB();
  await db.put(STORE_NAME, task);
};

// Get all tasks
export const getAllTasksFromDB = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

// Update a task
export const updateTaskInDB = async (task) => {
  const db = await initDB();
  await db.put(STORE_NAME, task);
};
