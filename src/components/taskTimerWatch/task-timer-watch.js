import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  IconButton,
} from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TaskContext } from "../tasks/context/task-context";
import { getTaskTimerFromDB } from "../../database/db";

const TaskTimerWatch = ({
  taskName,
  open,
  handleClose,
  timerSeconds: initialTimerSeconds = 25 * 60,
  taskId,
}) => {
  const { tasks, updateTaskTimer } = useContext(TaskContext);
  const [timerSeconds, setTimerSeconds] = useState(initialTimerSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // To track time elapsed in the current session

  console.log("tasks:", tasks, "taskId:", taskId);
  const currentTask = tasks?.find((task) => task.id === taskId);
  console.log("currentTask:", currentTask);


  // Load timer state and pomodoroQuantity from IndexedDB
  useEffect(() => {
    const fetchTimerState = async () => {
      const savedState = await getTaskTimerFromDB(taskId);
      if (savedState) {
        setTimerSeconds(savedState.timerSeconds);
        setIsRunning(savedState.isRunning);
      }
    };
    if (taskId) fetchTimerState();
  }, [taskId]);

  // Save timer state and update cumulative time in IndexedDB
  useEffect(() => {
    return () => {
      if (taskId && (timerSeconds !== initialTimerSeconds || isRunning)) {
        updateTaskTimer(taskId, { timerSeconds, isRunning, elapsedTime });
      }
    }
  }, [taskId, timerSeconds, isRunning]);
  
  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const progress = (timerSeconds / (25 * 60)) * 100;

  const handleStart = () => setIsRunning(true);

  const handlePause = async () => {
    setIsRunning(false);

    // Update pomodoroQuantity in the task
    const newPomodoroQuantity = (currentTask?.pomodoroQuantity || 0) + elapsedTime;
    setElapsedTime(0); // Reset elapsed time for the session
    if (taskId) {
      await updateTaskTimer(taskId, { pomodoroQuantity: newPomodoroQuantity });
    }
  };

  const handleCancel = async () => {
    setIsRunning(false);
    setTimerSeconds(25 * 60);
    const newPomodoroQuantity = (currentTask?.pomodoroQuantity || 0) + elapsedTime;
    setElapsedTime(0);
    if (taskId) {
      await updateTaskTimer(taskId, { pomodoroQuantity: newPomodoroQuantity });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#121212",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          width: 300,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {taskName}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ position: "relative", width: 200, height: 200 }}>
          <CircularProgressbar
            value={progress}
            text={formatTime(timerSeconds)}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: "#76c7c0",
              trailColor: "rgba(255, 255, 255, 0.2)",
            })}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#fff",
            mt: 2,
          }}
        >
          <AccessTimeIcon />
          <Typography variant="body1">
            Total Time: {formatTime(currentTask?.pomodoroQuantity || 0)}
          </Typography>
        </Box>

        {!isRunning && timerSeconds === 25 * 60 && (
          <Button
            variant="contained"
            onClick={handleStart}
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              textTransform: "none",
              borderRadius: "20px",
              px: 4,
            }}
          >
            Start
          </Button>
        )}

        {isRunning && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handlePause}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Pause
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Cancel
            </Button>
          </Box>
        )}

        {!isRunning && timerSeconds < 25 * 60 && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleStart}
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Start
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default TaskTimerWatch;
