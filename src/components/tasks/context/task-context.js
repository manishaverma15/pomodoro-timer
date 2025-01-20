import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  addTaskToDB,
  getAllTasksFromDB,
  updateTaskInDB,
  updateTaskTimerInDB,
} from "../../../database/db";
import { v4 as uuidv4 } from "uuid";
export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksFromDB = await getAllTasksFromDB();
      setTasks(tasksFromDB);
    };

    fetchTasks();
  }, []);

  const addTask = async (name) => {
    const task = { id: uuidv4(), name, completed: false, date: new Date() };
    await addTaskToDB(task);
    setTasks((prev) => [...prev, task]);
  };

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await updateTaskInDB(updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    }
  };

  const updateTaskTimer = async (taskId, updates) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );

    try {
      await updateTaskTimerInDB(taskId, updates);
    } catch (error) {
      console.error("Failed to update task timer:", error);
    }
  };

  // Derived state using useMemo
  const toBeCompleted = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  const completedTask = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const estimatedTime = useMemo(
    () => tasks.reduce((sum, task) => sum + (task.pomodoroQuantity || 0), 0),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTaskCompletion,
        updateTaskTimer,
        elapsedTime,
        setElapsedTime,
        toBeCompleted,
        completedTask,
        estimatedTime,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};










// import React, { createContext, useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { addTaskToDB, getAllTasksFromDB, updateTaskInDB, updateTaskTimerInDB  } from "../../../database/db";

// export const TaskContext = createContext();

// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const [estimatedTime, setEstimatedTime] = useState(0);
//   const [toBeCompleted, setToBeCompleted] = useState(0);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [completedTask, setCompletedTask] = useState(0);

//   // Fetch tasks and calculate initial "toBeCompleted" count
//   useEffect(() => {
//     const fetchTask = async () => {
//       const dbTasks = await getAllTasksFromDB();
//       console.log('db-task', dbTasks)
//       setTasks(dbTasks);

//       // Calculate incomplete tasks count
//       const incompleteTasks = dbTasks.filter((task) => !task.completed).length;
//       setToBeCompleted(incompleteTasks);
//     };
//     fetchTask();
//   }, []);

//   // Add a new task
//   const addTask = async (name) => {
//     const newTask = {
//       id: uuidv4(),
//       name,
//       date: new Date().toLocaleDateString(),
//       completed: false,
//     };
//     await addTaskToDB(newTask);

//     setTasks((prevTasks) => {
//       const updatedTasks = [newTask, ...prevTasks];

//       // Recalculate "toBeCompleted" based on updated tasks
//       const incompleteTasks = updatedTasks.filter((task) => !task.completed).length;
//       setToBeCompleted(incompleteTasks);

//       return updatedTasks;
//     });
//   };

//   // Toggle task completion
//   const toggleTaskCompletion = async (id) => {
//     setTasks((prevTasks) => {
//       const updatedTasks = prevTasks.map((task) =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//       );

//       // Update the task in IndexedDB
//       const toggledTask = updatedTasks.find((task) => task.id === id);
//       if (toggledTask) {
//         updateTaskInDB(toggledTask);

//         // Recalculate "toBeCompleted" based on updated tasks
//         const incompleteTasks = updatedTasks.filter((task) => !task.completed).length;
//         setToBeCompleted(incompleteTasks);
//       }

//       return updatedTasks;
//     });
//   };

//   const updateTaskTimer = async (taskId, updates) => {
//     setTasks((prevTasks) => {
//       const updatedTasks = prevTasks.map((task) =>
//         task.id === taskId ? { ...task, ...updates } : task
//       );
//       return updatedTasks;
//     });
  
//     try {
//       await updateTaskTimerInDB(taskId, updates);
//     } catch (error) {
//       console.error("Failed to update task timer:", error);
//     }
//   };
  

//   return (
//     <TaskContext.Provider
//       value={{
//         tasks,
//         addTask,
//         toggleTaskCompletion,
//         updateTaskTimer,
//         estimatedTime,
//         toBeCompleted,
//         elapsedTime,
//         completedTask,
//       }}
//     >
//       {children}
//     </TaskContext.Provider>
//   );
// };
