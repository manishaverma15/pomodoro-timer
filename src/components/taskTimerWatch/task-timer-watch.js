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
import { getTaskTimerFromDB, updateTaskInDB } from "../../database/db";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentTask = tasks?.find((task) => task.id === taskId);

  useEffect(() => {
    if (open) {
      setIsMinimized(false); // Ensure modal opens when play button is clicked again
    }
  }, [open]);
  
  // Load timer state and cumulative time from IndexedDB when opening the timer
  useEffect(() => {
    const fetchTimerState = async () => {
      if (!taskId) return;

      const savedState = await getTaskTimerFromDB(taskId);
      if (savedState) {
        setTimerSeconds(savedState.timerSeconds || initialTimerSeconds); // Resume from last saved time
        setElapsedTime(savedState.elapsedTime || 0);
        setIsRunning(false); // Ensure it does not start automatically
      }
    };

    fetchTimerState();
  }, [taskId]);

  // Timer countdown logic
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

  const handleStart = () => {
    setIsRunning(true);

    // Reset the timer to the initial 25 minutes if it was stopped previously
    if (timerSeconds === 0) {
      setTimerSeconds(25 * 60);
      setElapsedTime(0);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);

    if (!currentTask) return; // Ensure task exists

    // Calculate new total time used
    const updatedPomodoroQuantity = (currentTask.pomodoroQuantity || 0) + elapsedTime;

    // Save remaining time and elapsed time
    const updatedTask = {
      ...currentTask,
      pomodoroQuantity: updatedPomodoroQuantity,
      timerSeconds, // Save remaining time
      elapsedTime,  // Save session progress
    };

    // Update state and IndexedDB
    updateTaskTimer(taskId, updatedTask);
    await updateTaskInDB(updatedTask);

    console.log(`Total time used by task "${taskName}": ${formatTime(updatedPomodoroQuantity)}`);

    handleClose();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  const handleCloseModal = () => {
    setIsMinimized(false); // Reset minimized state
    handleClose(); // Call the original close function
  };
  

  return (
    <Modal open={open && !isMinimized} onClose={handleCloseModal}>
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
          <IconButton sx={{ color: "#fff" }} onClick={handleMinimize}>
            <KeyboardArrowDownIcon />
          </IconButton>
          <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
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
              onClick={handleStop}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Stop
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
              Continue
            </Button>
            <Button
              variant="contained"
              onClick={handleStop}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Stop
            </Button>
          </Box>
        )}

        {isMinimized && (
          <IconButton
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              backgroundColor: "#76c7c0",
              color: "#fff",
            }}
            onClick={handleRestore}
          >
            <AccessTimeIcon />
          </IconButton>
        )}

        {/* 
        {!isRunning && !showContinueCancel && (
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
        )}

        {showContinueCancel && (
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
              Continue
            </Button>
            <Button
              variant="contained"
              onClick={handleStop}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
              }}
            >
              Stop
            </Button>
          </Box>
        )} */}
      </Box>
    </Modal>
  );
};

export default TaskTimerWatch;
