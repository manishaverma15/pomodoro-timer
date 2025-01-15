import logo from './logo.svg';
import './App.css';
import PermanentDrawerLeft from './components/permanentDrawer/permanent-drawer';
import { TaskProvider } from './components/tasks/context/task-context';

function App() {
  return (
    <TaskProvider>
      <div className="App">
        <PermanentDrawerLeft />
      </div>
    </TaskProvider>
  );
}

export default App;
