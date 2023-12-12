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
  Paper
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill stylesheet
import OpenAI from "openai";

const DocumentEditor = () => {
  const [documents, setDocuments] = useState({});
  const [currentDocId, setCurrentDocId] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [summary, setSummary] = useState('');

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
  
  const getSummary = async () => {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Please summarize the following document: ${editorContent}` }
      ],
      model: "gpt-3.5-turbo",
    });
  
    setSummary(response.choices[0].message.content);
  };

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem('documents') || '{}');
    setDocuments(savedDocs);
  }, []);

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const saveDocument = () => {
    const newDocs = {
      ...documents,
      [currentDocId || new Date().toISOString()]: {
        title: newDocTitle || `Document - ${new Date().toISOString()}`,
        content: editorContent,
      },
    };
    setDocuments(newDocs);
    localStorage.setItem('documents', JSON.stringify(newDocs));
  
    // Keep the document in view mode after saving
    if (!currentDocId) {
      // If it's a new document, update the currentDocId
      const newDocId = new Date().toISOString();
      setCurrentDocId(newDocId);
    }
    setIsEditMode(false);
  };

  const openDocument = (docId) => {
    setCurrentDocId(docId);
    setEditorContent(documents[docId].content);
    setNewDocTitle(documents[docId].title);
    setIsEditMode(false);
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
                <Button variant="contained" color="secondary" onClick={editDocument} sx={{ marginTop: 2 }}>
                  Edit Doc
                </Button>
                <Button variant="contained" color="primary" onClick={() => getSummary()} sx={{ marginTop: 2, ml: 2 }}>
                  Summarize Document
                </Button>
                {summary && <Typography variant="body1" sx={{ mt: 4 }}>{summary}</Typography>}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentEditor;
