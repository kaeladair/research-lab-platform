import React from 'react';
import PersistentDrawerLayout from './PersistentDrawerLayout';
import Chat from './Chat';

function MyPage() {
  return (
    <PersistentDrawerLayout>
      <Chat />
      {/* More content can be added here */}
    </PersistentDrawerLayout>
  );
}

export default MyPage;
