import React from 'react';
import PersistentDrawerLayout from './PersistentDrawerLayout';
import { Typography } from '@mui/material';

function MyPage() {
  return (
    <PersistentDrawerLayout>
      <Typography paragraph>
        This is the main content of my page.
      </Typography>
      {/* More content can be added here */}
    </PersistentDrawerLayout>
  );
}

export default MyPage;
