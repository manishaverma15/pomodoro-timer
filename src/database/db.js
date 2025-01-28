import { openDB } from "idb";

const DB_NAME = "taskDatabase";
const DB_VERSION = 2; // Incremented version to ensure schema upgrade
const STORE_NAME = "tasks";
const TIMER_STORE_NAME = "taskTimers";

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      console.log("Upgrading database...");
      
      // Create main task store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log(`Creating object store: ${STORE_NAME}`);
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        store.createIndex("pomodoroQuantity", "pomodoroQuantity", { unique: false });
      }

      // Create task timer store
      if (!db.objectStoreNames.contains(TIMER_STORE_NAME)) {
        console.log(`Creating object store: ${TIMER_STORE_NAME}`);
        db.createObjectStore(TIMER_STORE_NAME, { keyPath: "taskId" });
      }
    },
  });

  return db;
};

// Add a new task
export const addTaskToDB = async (task) => {
  const db = await initDB();
  const newTask = { ...task, pomodoroQuantity: 0 }; // Initialize pomodoroQuantity
  await db.put(STORE_NAME, newTask);
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

  // Get the current task to update pomodoroQuantity
  const task = await db.get(STORE_NAME, taskId);
  if (task) {
    const elapsedTime = timerState.elapsedTime || 0;

    // Update pomodoroQuantity in the task
    const updatedTask = {
      ...task,
      pomodoroQuantity: (task.pomodoroQuantity || 0) + elapsedTime,
    };
    await db.put(STORE_NAME, updatedTask);
  }

  // Update the timer state in TIMER_STORE_NAME
  await db.put(TIMER_STORE_NAME, { taskId, ...timerState });
};

// Get a timer state by task ID
export const getTaskTimerFromDB = async (taskId) => {
  const db = await initDB();

  if (!db.objectStoreNames.contains(TIMER_STORE_NAME)) {
    console.error(`Object store ${TIMER_STORE_NAME} does not exist.`);
    return null;
  }

  return await db.get(TIMER_STORE_NAME, taskId) || null;
};

// Delete a timer state by task ID
export const deleteTaskTimerFromDB = async (taskId) => {
  try {
    const db = await initDB(); // Ensure `initDB` initializes your database properly
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await store.delete(taskId); // Delete the task by ID
    await transaction.oncomplete; // Wait for the transaction to finish
    console.log(`Task with ID ${taskId} deleted from timer store.`);

  } catch (error) {
    console.error(`Failed to delete timer for task with ID ${taskId}:`, error);
  }
};

// Get all timers (optional)
export const getAllTaskTimersFromDB = async () => {
  const db = await initDB();

  if (!db.objectStoreNames.contains(TIMER_STORE_NAME)) {
    console.error(`Object store ${TIMER_STORE_NAME} does not exist.`);
    return [];
  }

  return await db.getAll(TIMER_STORE_NAME);
};

// Clear the database (for development/debugging purposes)
export const clearDatabase = async () => {
  await indexedDB.deleteDatabase(DB_NAME);
  console.log(`Database ${DB_NAME} has been deleted.`);
};
