import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Modal, TextField, Button, List, ListItem, Checkbox, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

// Initial data structure
const initialColumns = {
  'column-1': {
    name: 'To do',
    items: [
      {
        id: 'item-1',
        content: 'Task 1',
        description: 'Description for Task 1',
        assignedTo: ['User 1'],
        subtasks: [{ id: 'subtask-1', title: 'Subtask 1', completed: false }],
        category: 'Development'
      },
      {
        id: 'item-2',
        content: 'Task 2',
        description: 'Description for Task 2',
        assignedTo: ['User 2'],
        subtasks: [{ id: 'subtask-2', title: 'Subtask 2', completed: false }],
        category: 'Design'
      }
    ],
  },
  'column-2': {
    name: 'In Progress',
    items: [],
  },
  'column-3': {
    name: 'Done',
    items: [],
  },
  // ... [add other columns if needed in the future]
};

// Styling for the modal
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
  const [assignments, setAssignments] = useState(task.assignedTo);
  const [subtasks, setSubtasks] = useState(task.subtasks);

  const handleSave = () => {
    onSave({ ...task, content: editContent, description: editDescription, assignedTo: assignments, subtasks });
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
      <List>
        {subtasks.map(subtask => (
          <ListItem key={subtask.id}>
            <Checkbox
              checked={subtask.completed}
              onChange={() => {
                setSubtasks(subtasks.map(st => st.id === subtask.id ? { ...st, completed: !st.completed } : st));
              }}
            />
            <ListItemText primary={subtask.title} />
          </ListItem>
        ))}
      </List>
      <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>Save</Button>
      <Button onClick={onCancel} sx={{ ml: 2 }}>Cancel</Button>
    </ModalContent>
  );
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];
  
    if (start === finish) {
      const newItems = Array.from(start.items);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);
  
      const newColumn = {
        ...start,
        items: newItems,
      };
  
      setColumns({
        ...columns,
        [source.droppableId]: newColumn,
      });
    } else {
      const startItems = Array.from(start.items);
      const [movedItem] = startItems.splice(source.index, 1);
      const finishItems = Array.from(finish.items);
      finishItems.splice(destination.index, 0, movedItem);
  
      const newStart = {
        ...start,
        items: startItems,
      };
  
      const newFinish = {
        ...finish,
        items: finishItems,
      };
  
      setColumns({
        ...columns,
        [source.droppableId]: newStart,
        [destination.droppableId]: newFinish,
      });
    }
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
    setColumns(prev => {
      const newColumns = { ...prev };
      for (const columnId in newColumns) {
        newColumns[columnId].items = newColumns[columnId].items.map(item => 
          item.id === updatedTask.id ? updatedTask : item
        );
      }
      return newColumns;
    });
    handleCloseModal();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                          <Typography variant="caption">Category: {item.category}</Typography>
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
    </DragDropContext>
  );
};

export default KanbanBoard;
