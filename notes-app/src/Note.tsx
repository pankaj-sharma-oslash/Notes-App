import React, { useState } from "react";

interface Note {
  id: string;
  title: string;
  description: string;
}

interface updateNoteProps {
  title: string;
  description: string;
}

interface NoteProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updateNote: updateNoteProps) => void;
}

function Note({ note, onDelete, onUpdate }: NoteProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const handleUpdate = () => {
    onUpdate(note.id, { title, description });
    setIsEditing(false);
  };
  return (
    <div
      style={{
        margin: "1rem 0",
        padding: "1rem",
        border: "1px solid gray",
        backgroundColor: "#f7f7f7",
        borderRadius: "10px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      {isEditing ? (
        <div>
          <div>
            <label
              htmlFor="title"
              style={{ color: "#444", fontWeight: "bold" }}
            >
              Title:
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "95%",
                padding: "0.5rem",
                border: "2px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              style={{ color: "#444", fontWeight: "bold" }}
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "95%",
                minHeight: "100px",
                padding: "0.5rem",
                border: "2px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            onClick={handleUpdate}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "0.5rem",
              border: "none",
              borderRadius: "5px",
              margin: "0.5rem 0.5rem 0.5rem 0",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "0.5rem",
              border: "none",
              borderRadius: "5px",
              margin: "0.5rem 0 0.5rem 0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ color: "#444", fontWeight: "bold" }}>
            Title: {note.id}
          </h3>
          <h3 style={{ color: "#444", fontWeight: "bold" }}>
            Title: {note.title}
          </h3>
          <h4 style={{ color: "#444" }}>Description: {note.description}</h4>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: "#008CBA",
              color: "white",
              padding: "0.5rem",
              border: "none",
              borderRadius: "5px",
              margin: "0.5rem 0.5rem 0.5rem 0",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "0.5rem",
              border: "none",
              borderRadius: "5px",
              margin: "0.5rem 0 0.5rem 0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default Note;
