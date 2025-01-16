import { openDB } from "idb";

const DB_NAME = "taskDatabase";
const STORE_NAME = "tasks";
const TIMER_STORE_NAME = "taskTimers";

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create main task store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }

      // Create task timer store
      if (!db.objectStoreNames.contains(TIMER_STORE_NAME)) {
        db.createObjectStore(TIMER_STORE_NAME, { keyPath: "taskId" });
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

// Add or update a timer state
export const updateTaskTimerInDB = async (taskId, timerState) => {
  const db = await initDB();
  await db.put(TIMER_STORE_NAME, { taskId, ...timerState });
};

// Get a timer state by task ID
export const getTaskTimerFromDB = async (taskId) => {
  const db = await initDB();
  return await db.get(TIMER_STORE_NAME, taskId) || null;
};

// Delete a timer state by task ID
export const deleteTaskTimerFromDB = async (taskId) => {
  const db = await initDB();
  await db.delete(TIMER_STORE_NAME, taskId);
};

// Get all timers (optional)
export const getAllTaskTimersFromDB = async () => {
  const db = await initDB();
  return await db.getAll(TIMER_STORE_NAME);
};
