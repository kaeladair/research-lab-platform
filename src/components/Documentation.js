import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill stylesheet
import OpenAI from "openai";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore database

const DocumentEditor = () => {
  const [documents, setDocuments] = useState({});
  const [currentDocId, setCurrentDocId] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
  
  useEffect(() => {
    const fetchDocuments = async () => {
      const querySnapshot = await getDocs(collection(db, "documents"));
      let fetchedDocs = {};
      querySnapshot.forEach((doc) => {
        fetchedDocs[doc.id] = { id: doc.id, ...doc.data() };
      });
      setDocuments(fetchedDocs);
    };
    fetchDocuments();
  }, []);

  const getSummary = async () => {
    setIsLoading(true);
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Please summarize the following document: ${editorContent}` }
      ],
      model: "gpt-3.5-turbo",
    });
  
    setSummary(response.choices[0].message.content);
    setIsLoading(false);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const saveDocument = async () => {
    const newDoc = {
      title: newDocTitle || `Document - ${new Date().toISOString()}`,
      content: editorContent,
    };
  
    let docId = currentDocId;
  
    if (currentDocId) {
      const docRef = doc(db, "documents", currentDocId);
      await updateDoc(docRef, newDoc);
    } else {
      const addedDocRef = await addDoc(collection(db, "documents"), newDoc);
      docId = addedDocRef.id;
      setCurrentDocId(docId);
    }
  
    setDocuments({ ...documents, [docId]: newDoc });
    setIsEditMode(false);
  };
  

  const openDocument = async (docId) => {
    const docRef = doc(db, "documents", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentDocId(docId);
      setEditorContent(docSnap.data().content);
      setNewDocTitle(docSnap.data().title);
      setIsEditMode(false);
    }
  };

  const editDocument = () => {
    setIsEditMode(true);
  };

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3, py: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ maxHeight: 600, overflow: 'auto' }}>
            <List>
              {Object.entries(documents).map(([id, doc]) => (
                <ListItem button key={id} onClick={() => openDocument(id)}>
                  <ListItemText primary={doc.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {isEditMode ? (
              <>
                <TextField
                  fullWidth
                  label="Document Title"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  margin="normal"
                />
                <ReactQuill value={editorContent} onChange={handleEditorChange} />
                <Button variant="contained" color="primary" onClick={saveDocument} sx={{ marginTop: 2 }}>
                  Save Document
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  {newDocTitle}
                </Typography>
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                <Box display="flex" flexDirection="column" alignItems="left">
                  <Box>
                    <Button variant="contained" color="primary" onClick={editDocument} sx={{mr: 1}}>
                      Edit
                    </Button>
                    <Button variant="contained" color="primary" onClick={getSummary}>
                      Summarize
                    </Button>
                  </Box>
                  {isLoading && <CircularProgress sx={{ mt: 3 }}/>}
                  {summary && <Typography variant="body1" sx={{ mt: 2 }}>{summary}</Typography>}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentEditor;
