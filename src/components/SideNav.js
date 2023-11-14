import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';

const drawerWidth = 240; // Custom width

const SideNav = ({ isOpen, toggleDrawer }) => {
    return (
        <Drawer
            anchor="left"
            open={isOpen}
            onClose={() => toggleDrawer(false)}
            sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
            <List>
                {/* Replace these with your actual navigation items */}
                <ListItem button onClick={() => toggleDrawer(false)}>
                    <ListItemIcon><CheckBoxIcon /></ListItemIcon>
                    <ListItemText primary="Tasks" />
                </ListItem>
                <ListItem button onClick={() => toggleDrawer(false)}>
                    <ListItemIcon><CheckBoxIcon /></ListItemIcon>
                    <ListItemText primary="Schedule" />
                </ListItem>
                <ListItem button onClick={() => toggleDrawer(false)}>
                    <ListItemIcon><ArticleIcon /></ListItemIcon>
                    <ListItemText primary="Documentation" />
                </ListItem>
                <ListItem button onClick={() => toggleDrawer(false)}>
                    <ListItemIcon><ChatIcon /></ListItemIcon>
                    <ListItemText primary="Chat" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default SideNav;
