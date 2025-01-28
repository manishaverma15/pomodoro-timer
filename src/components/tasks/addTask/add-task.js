import * as React from "react";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { format } from "date-fns";
import TaskTimerWatch from "../../taskTimerWatch/task-timer-watch";
import { TaskContext } from "../context/task-context";
import DeleteIcon from '@mui/icons-material/Delete';

const AddTask = () => {
  const {
    tasks,
    addTask,
    toggleTaskCompletion,
    estimatedTime,
    toBeCompleted,
    elapsedTime,
    completedTask,
    deleteTask
  } = React.useContext(TaskContext);

  const [taskInput, setTaskInput] = React.useState("");
  const [showCompleted, setShowCompleted] = React.useState(false);
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

  const handleDeleteTask = (id) => {
    deleteTask(id)
  };

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleOpenTimer = (task) => {
    setSelectedTask(task);
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

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <Box sx={{ marginTop: 3, width: "100%" }}>
            {pendingTasks.map((task) => (
              <Card key={task.id} sx={{ marginBottom: 2, width: "100%" }}>
                <CardContent sx={{ padding: "12px !important" }}>
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <ListItemIcon
                        onClick={() => toggleTaskCompletion(task.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        {task.completed ? (
                          <RadioButtonCheckedIcon color="success" />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </ListItemIcon>
                      <ListItemIcon
                        onClick={() => handleOpenTimer(task)}
                        sx={{ cursor: "pointer" }}
                      >
                        <PlayCircleOutlineIcon />
                      </ListItemIcon>
                      <ListItemText primary={task.name} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {format(new Date(task.date), "d MMM")}
                      </Typography>
                      <DeleteIcon onClick={() => handleDeleteTask(task.id)} />
                    </Box>
                  </ListItem>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

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

      {/* Completed Tasks Toggle */}
      <Box sx={{ margin: "20px 0" }}>
        <Button
          variant="contained"
          onClick={toggleShowCompleted}
          sx={{ marginBottom: 2, textTransform: "capitalize" }}
        >
          {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
          {showCompleted ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>
        {showCompleted && completedTasks.length > 0 && (
          <Box sx={{ marginTop: 3, width: "100%" }}>
            {completedTasks.map((task) => (
              <Card key={task.id} sx={{ marginBottom: 2, width: "100%" }}>
                <CardContent sx={{ padding: "12px !important" }}>
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <ListItemIcon
                        onClick={() => toggleTaskCompletion(task.id)}
                        sx={{ cursor: "pointer", minWidth: "33px" }}
                      >
                        <RadioButtonCheckedIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              textDecoration: "line-through",
                            }}
                          >
                            {task.name}
                          </Typography>
                        }
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {format(new Date(task.date), "d MMM")}
                      </Typography>
                      <DeleteIcon onClick={() => handleDeleteTask(task.id)} />
                    </Box>
                  </ListItem>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddTask;
