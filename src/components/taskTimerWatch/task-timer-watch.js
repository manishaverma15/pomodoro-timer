import React from "react";
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

const TaskTimerWatch = ({
  taskName,
  open,
  handleClose,
  timerSeconds,
  onPause,
  onStart,
  isRunning,
  taskId
}) => {
  const { toggleTaskCompletion, tasks } = React.useContext(TaskContext);

  const currentTask = tasks.find((task) => task.id === taskId);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const progress = (timerSeconds / (25 * 60)) * 100;

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
            <IconButton
              onClick={() => toggleTaskCompletion(taskId)}
              sx={{ cursor: "pointer" }}
            >
              {currentTask?.completed ? (
                <RadioButtonCheckedIcon color="success" />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </IconButton>
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

          {/* <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              flex: 1,
              textAlign: "center",
              gap: 4
            }}
          >
            {taskName}
          </Typography> */}
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

        <Button
          variant="contained"
          onClick={isRunning ? onPause : onStart}
          sx={{
            backgroundColor: isRunning ? "#f44336" : "#4caf50",
            color: "#fff",
            textTransform: "none",
            borderRadius: "20px",
            px: 4,
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskTimerWatch;
