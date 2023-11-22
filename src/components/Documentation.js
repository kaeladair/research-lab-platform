import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const Documentation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <ReactQuill value={text} onChange={setText} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      )}
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Documentation;
