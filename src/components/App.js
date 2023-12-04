import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PersistentDrawerLayout from './PersistentDrawerLayout';
import Chat from './Chat';
import KanbanBoard from './KanbanBoard';
import Documentation from './Documentation';
import Calendar from './Calendar';

function MyPage() {
  return (
    <Router>
      <PersistentDrawerLayout>
        {/* Route Configuration */}
        <Routes>
          <Route path="/tasks" element={<KanbanBoard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/schedule" element={<Calendar />} />
        </Routes>
      </PersistentDrawerLayout>
    </Router>
  );
}

export default MyPage;

