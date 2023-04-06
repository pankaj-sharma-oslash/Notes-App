import React, { useState } from "react";
import Note from "./Note";
interface Notetypes {
  id: string;
  title: string;
  description: string;
}

function SingleNote() {
  const [noteId, setNoteID] = useState("");
  const [showError, setShowError] = useState(false);
  const [showNote, setShowNote] = useState(false)
  const [note, setNote] = useState<Notetypes>({
    id: "",
    title: "",
    description: "",
  });

  const fetchNote = async (noteId: string) => {
    const response = await fetch("/single-note", {
      method: "POST",
      body: JSON.stringify({
        key: noteId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message) {
        setShowError(true);
      } else {
        setShowNote(true)
        setNote(data);
      }
    } else {
      setShowError(true);
      console.error("Response error:", response.statusText);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        marginTop: "1rem",
        padding: "1rem",
        backgroundColor: "#f2f2f2",
        borderRadius: "10px",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2c3e50",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontWeight: "bold",
          fontSize: "2.5rem",
          margin: "0",
          marginBottom: "2rem",
        }}
      >
        Notes App
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="title"
            style={{
              color: "#2c3e50",
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
            }}
          >
            ID:
          </label>
          <input
            id="id"
            name="id"
            value={noteId}
            onChange={(e) => setNoteID(e.target.value)}
            placeholder="Enter id..."
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#e6e6e6",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </div>
      <button
        onClick={() => {
          fetchNote(noteId);
        }}
        style={{
          backgroundColor: "#3498db",
          color: "#fff",
          padding: "0.8rem 1.5rem",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          fontSize: "1.2rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "2rem",
          cursor: "pointer",
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        Search
      </button>
      {showError ? (
        <p>Note not found in the database</p>
      ) : (
        showNote ? (
        <Note
          key={noteId}
          note={note}
          onDelete={() => {}}
          onUpdate={() => {}}
        /> ) : (
          null
        )
      )}
    </div>
  );
}

export default SingleNote;
