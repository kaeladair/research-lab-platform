import React from 'react';
import PersistentDrawerLayout from './PersistentDrawerLayout';
import Chat from './Chat';

function MyPage() {
  return (
    <PersistentDrawerLayout>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Chat />
      </div>
      {/* More content can be added here */}
    </PersistentDrawerLayout>
  );
}

export default MyPage;
