import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

const TasksList = ({
  pendingTasks,
  completedTasks,
  toggleTaskCompletion,
  deleteTask,
  setSelectedTask,
}) => {
  const [showCompleted, setShowCompleted] = React.useState(false);

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleOpenTimer = (task) => {
    setSelectedTask(task);
  };

  return (
    <Box sx={{ width: "100%", marginTop: 3 }}>
      {/* Pending Tasks */}
      {pendingTasks.length > 0 &&
        pendingTasks.map((task) => (
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
                    <RadioButtonUncheckedIcon />
                  </ListItemIcon>
                  <ListItemIcon
                    onClick={() => handleOpenTimer(task)}
                    sx={{ cursor: "pointer" }}
                  >
                    <PlayCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary={task.name} />
                </Box>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {format(new Date(task.date), "d MMM")}
                  </Typography>
                  <DeleteIcon onClick={() => deleteTask(task.id)} />
                </Box>
              </ListItem>
            </CardContent>
          </Card>
        ))}

      {/* Completed Tasks Toggle */}
      <Box sx={{ margin: "20px 0" }}>
        <Button variant="contained" onClick={toggleShowCompleted} sx={{ textTransform: "capitalize" }}>
          {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
          {showCompleted ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>

        {showCompleted &&
          completedTasks.length > 0 &&
          completedTasks.map((task) => (
            <Card key={task.id} sx={{ marginBottom: 2, width: "100%" }}>
              <CardContent sx={{ padding: "12px !important" }}>
                <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <ListItemIcon
                      onClick={() => toggleTaskCompletion(task.id)}
                      sx={{ cursor: "pointer", minWidth: "33px" }}
                    >
                      <RadioButtonCheckedIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography sx={{ textDecoration: "line-through" }}>{task.name}</Typography>}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {format(new Date(task.date), "d MMM")}
                    </Typography>
                    <DeleteIcon onClick={() => deleteTask(task.id)} />
                  </Box>
                </ListItem>
              </CardContent>
            </Card>
          ))}
      </Box>
    </Box>
  );
};

export default TasksList;
