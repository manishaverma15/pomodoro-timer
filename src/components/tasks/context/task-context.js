import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { addTaskToDB, getAllTasksFromDB, updateTaskInDB } from "../../../database/db";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [toBeCompleted, setToBeCompleted] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedTask, setCompletedTask] = useState(0);

  // Fetch tasks and calculate initial "toBeCompleted" count
  useEffect(() => {
    const fetchTask = async () => {
      const dbTasks = await getAllTasksFromDB();
      console.log('db-task', dbTasks)
      setTasks(dbTasks);

      // Calculate incomplete tasks count
      const incompleteTasks = dbTasks.filter((task) => !task.completed).length;
      setToBeCompleted(incompleteTasks);
    };
    fetchTask();
  }, []);

  // Add a new task
  const addTask = async (name) => {
    const newTask = {
      id: uuidv4(),
      name,
      date: new Date().toLocaleDateString(),
      completed: false,
    };
    await addTaskToDB(newTask);

    setTasks((prevTasks) => {
      const updatedTasks = [newTask, ...prevTasks];

      // Recalculate "toBeCompleted" based on updated tasks
      const incompleteTasks = updatedTasks.filter((task) => !task.completed).length;
      setToBeCompleted(incompleteTasks);

      return updatedTasks;
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Update the task in IndexedDB
      const toggledTask = updatedTasks.find((task) => task.id === id);
      if (toggledTask) {
        updateTaskInDB(toggledTask);

        // Recalculate "toBeCompleted" based on updated tasks
        const incompleteTasks = updatedTasks.filter((task) => !task.completed).length;
        setToBeCompleted(incompleteTasks);
      }

      return updatedTasks;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTaskCompletion,
        estimatedTime,
        toBeCompleted,
        elapsedTime,
        completedTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
