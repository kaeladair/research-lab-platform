import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig'; // Adjust the import path as needed
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = auth.currentUser;

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (newMessage.trim()) {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                uid: user.uid,
                senderName: user.displayName, // User's name from Google account
                timestamp: serverTimestamp() // Using serverTimestamp from 'firebase/firestore'
            });
            setNewMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map(msg => (
                    <p key={msg.id}>
                        <strong>{msg.uid === user.uid ? 'Me' : (msg.senderName || 'Anonymous')}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;
