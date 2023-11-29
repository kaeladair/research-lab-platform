import React, { useState } from 'react';
import PersistentDrawerLayout from './PersistentDrawerLayout';
import Chat from './Chat';
import KanbanBoard from './KanbanBoard';
import Documentation from './Documentation';
import Calendar from './Calendar';

function MyPage() {
  const [activeComponent, setActiveComponent] = useState('Tasks');

  const handleMenuItemClick = (text) => {
    setActiveComponent(text);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Tasks':
        return <KanbanBoard />;
      case 'Chat':
        return <Chat />;
      case 'Docs':
        return <Documentation />;
      case 'Lab Schedule':
        return <Calendar />
      default:
        return null;
    }
  };

  return (
    <PersistentDrawerLayout onMenuItemClick={handleMenuItemClick}>
      {renderComponent()}
      {/* More content can be added here */}
    </PersistentDrawerLayout>
  );
}

export default MyPage;
