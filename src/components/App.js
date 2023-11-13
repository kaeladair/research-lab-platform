import React, { useState } from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';

const App = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setSideNavOpen(open);
  };

  return (
    <div>
      <TopNav onMenuClick={() => setSideNavOpen(true)} />
      <SideNav isOpen={sideNavOpen} toggleDrawer={toggleDrawer} />
      {/* Your app content here */}
    </div>
  );
};

export default App;
