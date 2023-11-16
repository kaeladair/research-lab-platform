import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Box, TextField, IconButton, List, ListItem, Paper, Typography, Container, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = auth.currentUser;

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
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, []);

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

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4, height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Paper elevation={3} sx={{ overflow: 'auto', maxHeight: '70vh', mb: 2, padding: '20px' }}>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem key={msg.id} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                    {msg.senderName.charAt(0)}
                                </Avatar>
                                <div>
                                    <Typography variant="subtitle2">
                                        {msg.senderName || 'Anonymous'} <Typography variant="caption" sx={{ color: 'text.secondary' }}>{format(msg.timestamp, 'p, MMMM dd')}</Typography>
                                    </Typography>
                                    <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                                        {msg.text}
                                    </Typography>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={sendMessage}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{ mr: 1 }}
                    />
                    <IconButton color="primary" type="submit">
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
}

export default Chat;
