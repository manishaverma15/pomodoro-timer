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
import { TaskContext } from "../tasks/context/task-context";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { updateTaskTimerInDB, getTaskTimerFromDB } from "../../database/db";

const TaskTimerWatch = ({
  taskName,
  open,
  handleClose,
  timerSeconds: initialTimerSeconds = 25 * 60,
  taskId,
}) => {
  const { toggleTaskCompletion, tasks } = useContext(TaskContext);
  const [timerSeconds, setTimerSeconds] = useState(initialTimerSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const currentTask = tasks.find((task) => task.id === taskId);

  // Load timer state from IndexedDB
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

  // Save timer state to IndexedDB
  useEffect(() => {
    if (taskId) {
      updateTaskTimerInDB(taskId, { timerSeconds, isRunning });
    }
  }, [taskId, timerSeconds, isRunning]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
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
  const handlePause = () => setIsRunning(false);
  const handleCancel = () => {
    setIsRunning(false);
    setTimerSeconds(25 * 60);
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <IconButton
              onClick={() => toggleTaskCompletion(taskId)}
              sx={{ cursor: "pointer" }}
            >
              {currentTask?.completed ? (
                <RadioButtonCheckedIcon color="success" />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </IconButton> */}
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
