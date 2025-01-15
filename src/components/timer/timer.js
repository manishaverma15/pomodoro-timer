import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";

const TaskTimer = ({ task, activeTaskId, timers, handleStartTimer, handleStopTimer }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {timers[task.id] ? formatTime(timers[task.id]) : "00:00"}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        sx={{ textTransform: "none" }}
      >
        Show Timer
      </Button>

      {/* Modal for Timer Popup */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6">Task Timer</Typography>
          <Typography variant="h3" sx={{ fontFamily: "monospace" }}>
            {timers[task.id] ? formatTime(timers[task.id]) : "00:00"}
          </Typography>
          <Button
            variant={activeTaskId === task.id ? "contained" : "outlined"}
            color="primary"
            onClick={() =>
              activeTaskId === task.id
                ? handleStopTimer()
                : handleStartTimer(task.id)
            }
          >
            {activeTaskId === task.id ? "Stop Timer" : "Start Timer"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskTimer;
