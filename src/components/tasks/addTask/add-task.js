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
import { TaskContext } from "../context/task-context";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { format } from "date-fns";
import TaskTimerWatch from "../../taskTimerWatch/task-timer-watch";


const AddTask = () => {
  const {
    tasks,
    addTask,
    toggleTaskCompletion,
    estimatedTime,
    toBeCompleted,
    elapsedTime,
    completedTask,
  } = React.useContext(TaskContext);

  const [taskInput, setTaskInput] = React.useState("");
  const [showCompleted, setShowCompleted] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState(null);
  const [timers, setTimers] = React.useState({});
  const [selectedTask, setSelectedTask] = React.useState(null);

  const handleAddTask = (e) => {
    if (e.key === "Enter" && taskInput.trim()) {
      addTask(taskInput);
      setTaskInput("");
    }
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
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <Box>
      <Box>
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
              <Typography variant="body2">Elapsed Time </Typography>
            </Box>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="h6">{completedTask}</Typography>
              <Typography variant="body2">Completed Tasks</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

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

        {tasks.length > 0 && (
          <Box sx={{ marginTop: 3, width: "100%" }}>
            {tasks
              .filter((task) => !task.completed)
              .map((task) => (
                <Card key={task.id} sx={{ marginBottom: 2, width: "100%" }}>
                  <CardContent sx={{ padding: "12px !important" }}>
                    <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
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
                        <ListItemIcon onClick={() => handleOpenTimer(task)} sx={{ cursor: 'pointer' }}>
                          <PlayCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography>
                              {task.name}
                            </Typography>
                          }
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {format(new Date(task.date), "d MMM")}
                      </Typography>

                      {selectedTask && (
                        <TaskTimerWatch
                          taskName={selectedTask.name}
                          open={!!selectedTask}
                          handleClose={handleCloseTimer}
                          timerSeconds={25 * 60}
                          onStart={() => console.log('Timer started')}
                          onPause={() => console.log('Timer paused')}
                          isRunning={false}
                        />
                      )}
                    </ListItem>
                  </CardContent>
                </Card>
              ))}
          </Box>
        )}
      </Box>

      <Box sx={{ margin: "20px 0" }}>
        <Button
          variant="contained"
          onClick={toggleShowCompleted}
          sx={{ marginBottom: 2, textTransform: 'capitalize' }}
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
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <ListItemIcon
                        onClick={() => toggleTaskCompletion(task.id)}
                        sx={{ cursor: "pointer", minWidth: '33px' }}
                      >
                        {task.completed ? (
                          <RadioButtonCheckedIcon color="success" />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </ListItemIcon>
                      <ListItemIcon>
                        <PlayCircleOutlineIcon sx={{ color: '#D3D3D3' }} />
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

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {format(new Date(task.date), "d MMM")}
                    </Typography>
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
