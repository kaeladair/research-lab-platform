import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { format, isSameDay } from 'date-fns';
import { Stack, TextField, Button, List, ListItem, Card, Typography, Avatar, Divider, Box, Fab, useTheme, useMediaQuery, Fade, CssBaseline } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const user = auth.currentUser;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
        };
      });
      setMessages(groupMessagesByDate(msgs));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let lastDate = null;

    messages.forEach(msg => {
      if (!lastDate || !isSameDay(lastDate, msg.timestamp)) {
        lastDate = msg.timestamp;
        grouped.push({ date: lastDate, messages: [msg] });
      } else {
        grouped[grouped.length - 1].messages.push(msg);
      }
    });

    return grouped;
  };

  const handleScroll = (e) => {
    const bottomThreshold = 100; // Pixels from the bottom to show the button
    const isAtBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < bottomThreshold;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShowScrollButton(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        uid: user.uid,
        senderName: user.displayName || 'Anonymous',
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    }
  };

  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ height: 'calc(100vh - 64px)', bgcolor: 'background.default', maxWidth: '100vw' }}
      >
        <List sx={{ overflowY: 'auto', flexGrow: 1, px: 2, py: 1 }} onScroll={handleScroll}>
          {messages.map((group, index) => (
            <React.Fragment key={index}>
              <Divider textAlign="center" sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {format(group.date, 'eeee, MMMM do')}
                </Typography>
              </Divider>
              {group.messages.map((msg) => (
                <ListItem key={msg.id} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {msg.senderName.charAt(0)}
                  </Avatar>
                  <Card variant="outlined" sx={{ p: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {msg.senderName || 'Anonymous'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {format(msg.timestamp, 'p')}
                    </Typography>
                    <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                      {msg.text}
                    </Typography>
                  </Card>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
        {showScrollButton && (
            <Fade in={showScrollButton}>
              <Box sx={{ position: 'absolute', bottom: theme.spacing(12), right: '50%', transform: 'translateX(50%)' }}>
                <Fab color="primary" size="small" onClick={scrollToBottom}>
                  <ArrowDownwardIcon />
                </Fab>
              </Box>
            </Fade>
          )}
        <Box component="form" onSubmit={sendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" endIcon={ <SendIcon />} type="submit" sx={{ height: 55 }}>
                SEND
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}

export default Chat;
