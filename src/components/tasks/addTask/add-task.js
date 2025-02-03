import * as React from "react";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskContext } from "../context/task-context";
import TaskTimerWatch from "../../taskTimerWatch/task-timer-watch";
import TasksList from "../tasksList/tasks-list";

const AddTask = () => {
  const {
    tasks,
    addTask,
    estimatedTime,
    toBeCompleted,
    elapsedTime,
    completedTask,
    toggleTaskCompletion,
    deleteTask,
  } = React.useContext(TaskContext);

  const [taskInput, setTaskInput] = React.useState("");
  const [selectedTask, setSelectedTask] = React.useState(null);

  // Memoized task lists
  const pendingTasks = React.useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const completedTasks = React.useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  const handleAddTask = (e) => {
    if (e.key === "Enter" && taskInput.trim()) {
      addTask(taskInput);
      setTaskInput("");
    }
  };

  const handleCloseTimer = () => {
    setSelectedTask(null);
  };

  return (
    <Box>
      {/* Task Summary */}
      <Card
        sx={{
          width: "100%",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h6">{estimatedTime}</Typography>
            <Typography variant="body2">Estimated Time</Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h6">{toBeCompleted}</Typography>
            <Typography variant="body2">Tasks to be completed</Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h6">{elapsedTime}</Typography>
            <Typography variant="body2">Elapsed Time</Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h6">{completedTask}</Typography>
            <Typography variant="body2">Completed Tasks</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Task Input */}
      <Box
        sx={{
          width: "100%",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ width: "100%" }}
          placeholder='Add a task to "Tasks", press [Enter] to save'
          variant="outlined"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleAddTask}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AddIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Task List */}
      <TasksList
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        setSelectedTask={setSelectedTask}
      />

      {/* Task Timer */}
      {selectedTask && (
        <TaskTimerWatch
          taskName={selectedTask.name}
          open={!!selectedTask}
          handleClose={handleCloseTimer}
          timerSeconds={25 * 60}
          onStart={() => console.log("Timer started")}
          onPause={() => console.log("Timer paused")}
          isRunning={false}
          taskId={selectedTask.id}
        />
      )}
    </Box>
  );
};

export default AddTask;