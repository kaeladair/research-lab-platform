import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { format, isSameDay } from 'date-fns';
import { Box, TextField, IconButton, List, ListItem, Paper, Typography, Container, Avatar, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Icon for the 'Scroll to Current' button

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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
        const upperLimit = 100; // Adjust as needed
        const scrolledUp = e.target.scrollTop < upperLimit;
        setShowScrollButton(scrolledUp);
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

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4, height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Paper elevation={3} sx={{ overflow: 'auto', maxHeight: '70vh', mb: 2, padding: '20px', position: 'relative' }} onScroll={handleScroll}>
                    <List>
                        {messages.map((group, index) => (
                            <React.Fragment key={index}>
                                <Divider sx={{ my: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {format(group.date, 'eeee, MMMM do')}
                                    </Typography>
                                </Divider>
                                {group.messages.map((msg) => (
                                    <ListItem key={msg.id} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            {msg.senderName.charAt(0)}
                                        </Avatar>
                                        <div>
                                            <Typography variant="subtitle2">
                                                {msg.senderName || 'Anonymous'} <Typography variant="caption" sx={{ color: 'text.secondary' }}>{format(msg.timestamp, 'p')}</Typography>
                                            </Typography>
                                            <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                                                {msg.text}
                                            </Typography>
                                        </div>
                                    </ListItem>
                                ))}
                            </React.Fragment>
                        ))}
                    </List>
                    <div ref={messagesEndRef} />
                    {showScrollButton && (
                        <IconButton sx={{ position: 'absolute', right: 20, bottom: 20 }} onClick={scrollToBottom}>
                            <ArrowDownwardIcon />
                        </IconButton>
                    )}
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
