import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  addTaskToDB,
  deleteTaskTimerFromDB,
  getAllTasksFromDB,
  updateTaskInDB,
  updateTaskTimerInDB,
} from "../../../database/db";
import { v4 as uuidv4 } from "uuid";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setestimatedTime] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksFromDB = await getAllTasksFromDB();
      setTasks(tasksFromDB);
    };

    fetchTasks();
  }, []);

  const addTask = async (name) => {
    const task = { id: uuidv4(), name, completed: false, date: new Date(), pomodoroQuantity: 0 };
    await addTaskToDB(task);
    setTasks((prev) => [task, ...prev]);
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
    // Update task state in the context
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );

    // Update task timer in the database
    try {
      await updateTaskTimerInDB(taskId, updates);
    } catch (error) {
      console.error("Failed to update task timer:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskTimerFromDB(id);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };


  const toBeCompleted = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  const completedTask = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTaskCompletion,
        updateTaskTimer,
        deleteTask,
        elapsedTime,
        setElapsedTime,
        toBeCompleted,
        completedTask,
        estimatedTime
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
