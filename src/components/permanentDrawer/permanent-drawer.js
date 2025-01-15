import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { red, purple, blue, green, grey } from '@mui/material/colors';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddTask from '../tasks/addTask/add-task';

// Dummy components to show on navigation
const Tomorrow = () => <Typography variant="h4">Tomorrow Component</Typography>;
const ThisWeek = () => <Typography variant="h4">This Week Component</Typography>;
const Planned = () => <Typography variant="h4">Planned Component</Typography>;
const Completed = () => <Typography variant="h4">Completed Component</Typography>;

const drawerWidth = 240;

const menuItems = [
  { name: 'Today', icon: <LightModeIcon />, color: green[300], route: '/' },
  { name: 'Tomorrow', icon: <WbTwilightIcon />, color: red[300], route: '/tomorrow' },
  { name: 'This Week', icon: <CalendarMonthIcon />, color: purple[300], route: '/this-week' },
  { name: 'Planned', icon: <EventAvailableIcon />, color: blue[300], route: '/planned' },
  { name: 'Completed', icon: <CheckCircleIcon />, color: grey[300], route: '/completed' },
];

const PermanentDrawerLeft = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  }

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              display: 'flex',
              alignItems: 'center',
              padding: 1,
              bgcolor: 'background.paper',
              borderBottom: '1px solid #ccc',
              zIndex: 1201,
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 40, color: 'gray', marginRight: 1 }} />
            <Typography variant="body1" color="error">
              Sign In | Sign Up
            </Typography>
          </Box>

          <Toolbar />
          <List>
            {menuItems.map(({ name, icon, color, route, index }) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  to={route}>
                  <ListItemIcon>{React.cloneElement(icon, { sx: { color } })}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<AddTask />} />
            <Route path="/tomorrow" element={<Tomorrow />} />
            <Route path="/this-week" element={<ThisWeek />} />
            <Route path="/planned" element={<Planned />} />
            <Route path="/completed" element={<Completed />} />
            {/* <Route path="/" element={<Typography variant="h4">Welcome to the App!</Typography>} /> */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default PermanentDrawerLeft;
