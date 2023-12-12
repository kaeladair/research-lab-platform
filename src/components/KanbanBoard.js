import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Modal, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig.js';

const TaskModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  outline: 'none',
}));

const TaskModalContent = ({ task, onSave, onCancel }) => {
  const [editContent, setEditContent] = useState(task.content);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleSave = () => {
    onSave({ ...task, content: editContent, description: editDescription});
  };

  return (
    <ModalContent>
      <Typography variant="h6">Edit Task</Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Content"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
      />
      <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>Save</Button>
      <Button onClick={onCancel} sx={{ ml: 2 }}>Cancel</Button>
    </ModalContent>
  );
};

const NewTaskForm = ({ onSave, onCancel }) => {
  const [newContent, setNewContent] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleSave = () => {
    onSave({ content: newContent, description: newDescription, columnId: 'column-1' });
    setNewContent('');
    setNewDescription('');
  };

  return (
    <ModalContent>
      <Typography variant="h6">Create New Task</Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Content"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>Create</Button>
      <Button onClick={onCancel} sx={{ ml: 2 }}>Cancel</Button>
    </ModalContent>
  );
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    'column-1': { name: 'To Do', items: [] },
    'column-2': { name: 'In Progress', items: [] },
    'column-3': { name: 'Done', items: [] }
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const newTasks = {
            'column-1': { name: 'To Do', items: [] },
            'column-2': { name: 'In Progress', items: [] },
            'column-3': { name: 'Done', items: [] }
        };
        querySnapshot.forEach((doc) => {
            const taskData = doc.data();
            const columnId = taskData.columnId;
            if (newTasks[columnId]) {
                newTasks[columnId].items.push({ ...taskData, id: doc.id });
            }
        });
        setColumns(newTasks);
    } catch (error) {
        console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTaskToFirestore = async (newTask) => {
    await addDoc(collection(db, "tasks"), newTask);
    fetchTasks();
  };

  const updateTaskInFirestore = async (updatedTask) => {
    const taskRef = doc(db, "tasks", updatedTask.id);
    await updateDoc(taskRef, updatedTask);
    fetchTasks();
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];
  
    const startItems = Array.from(start.items);
    const finishItems = finish === start ? startItems : Array.from(finish.items);
    const [movedItem] = startItems.splice(source.index, 1);
  
    if (start === finish) {
      startItems.splice(destination.index, 0, movedItem);
    } else {
      finishItems.splice(destination.index, 0, movedItem);
    }
  
    const newColumns = {
      ...columns,
      [source.droppableId]: { ...start, items: startItems },
      [destination.droppableId]: { ...finish, items: finishItems },
    };
  
    setColumns(newColumns);
  
    // Firestore update
    updateTaskInFirestore({ ...movedItem, columnId: destination.droppableId });
  };
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    if (updatedTask.id) {
      updateTaskInFirestore(updatedTask);
    } else {
      addTaskToFirestore(updatedTask);
    }
    handleCloseModal();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>

      <Button variant="contained" color="primary" onClick={() => setIsNewTaskModalOpen(true)} sx={{ m: 3, mb: 0 }}>
        Add New Task
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, gap: 2, flexWrap: 'wrap' }}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Box key={columnId} sx={{ width: 250, margin: 1, flex: '1 1 auto' }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', color: '#ffffff' }}>
              {column.name}
            </Typography>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <Paper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    background: snapshot.isDraggingOver ? '#1E1E1E' : '#1E1E1E',
                    padding: 2,
                    minHeight: 500,
                    boxShadow: 3
                  }}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleTaskClick(item)}
                          sx={{
                            userSelect: 'none',
                            padding: 2,
                            margin: '0 0 8px 0',
                            minHeight: '50px',
                            backgroundColor: snapshot.isDragging ? '#e1f5fe' : '#bbdefb',
                            color: '#0d47a1',
                            boxShadow: 1,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Typography variant="subtitle1">{item.content}</Typography>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          </Box>
        ))}
      </Box>
  
      {selectedTask && (
        <TaskModal open={isModalOpen} onClose={handleCloseModal}>
          <TaskModalContent
            task={selectedTask}
            onSave={handleSaveTask}
            onCancel={handleCloseModal}
          />
        </TaskModal>
      )}

      {isNewTaskModalOpen && (
        <TaskModal open={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)}>
          <NewTaskForm onSave={handleSaveTask} onCancel={() => setIsNewTaskModalOpen(false)} />
        </TaskModal>
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
