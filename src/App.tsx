import React from 'react';
import Clock from './components/Clock';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-layout">
      <header className="app-header glass-panel">
        <div className="logo">
          <h1>Productivity</h1>
        </div>
        <div className="header-clock">
          <Clock />
        </div>
      </header>

      <main className="app-main container">
        <div className="grid-layout">
          <section className="calendar-section glass-panel">
            <h2>Calendar</h2>
            <Calendar />
          </section>

          <section className="todo-section glass-panel">
            <h2>Tasks</h2>
            <TaskList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
