import React from 'react';
import PersistentDrawerLayout from './PersistentDrawerLayout';
import Chat from './Chat';
import KanbanBoard from './KanbanBoard';

function MyPage() {
  return (
    <PersistentDrawerLayout>
      <KanbanBoard />
      {/* More content can be added here */}
    </PersistentDrawerLayout>
  );
}

export default MyPage;
