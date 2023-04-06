import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Note from './Note';
import { Link } from 'react-router-dom';

interface Notetypes {
  id: string;
  title: string;
  description: string
}

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState<Notetypes[]>([]);
  const url = "https://notes-worker.jangidp318.workers.dev/"

  const fetchNotes = async () => {
    const response = await fetch("/api-call", {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      setNotes(data)
    } else {
      console.error("Response error:", response.statusText);
    }
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((sw) => {
        console.log(sw.scope)
        fetchNotes().then(() => {}).catch(() => {})
      }).catch(() => {})
    }
  }, [])

  const addNote = async () => {
    if( title === "" && description === ""){
      return alert("Please Enter Data...!")
    }
    const key = uuidv4()
    setNotes([...notes, {id: key, title, description}])
    const response = await fetch('/add-note', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "action": {"type": "ADD", "key": key, "value": { "title": title, "description": description } } } )
    })
    if(response.ok) {
      console.log("Note added")
    }
    if (!response.ok) {
      throw new Error(`Failed to add note: ${response.status} ${response.statusText}`);
    }
  };

  const deleteNote = async (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    const response = await fetch('/delete-note', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "action": { "type": "DELETE", "key": id } })
    })
    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
    }
  };

  const updateNote = async (id: string, updates: { title: string, description: string}) => {
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return { ...note, ...updates };
        } else {
          return note;
        }
      })
    );

    const response = await fetch('/edit-note', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "action": { "type": "EDIT", "key": id , "value": { "title": updates.title, "description": updates.description }}})
    })
    if (!response.ok) {
      throw new Error(`Failed to edit note: ${response.status} ${response.statusText}`);
    }
    await fetchNotes()
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: 'auto', 
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#f2f2f2',
      borderRadius: '10px',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    }}>
      <h1 style={{ 
        textAlign: 'center',
        color: '#2c3e50',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        margin: '0',
        marginBottom: '2rem',
      }}>Notes App</h1>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Link to={'/single-note'}>
          Single Note
        </Link>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ 
            color: '#2c3e50',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
          }}>Title:</label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={{ 
              marginLeft: '0.5rem',
              padding: '0.5rem',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: '#e6e6e6',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description" style={{ 
            color: '#2c3e50',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
          }}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={{ 
              marginLeft: '0.5rem',
              padding: '0.5rem',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: '#e6e6e6',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>
      </div>
      <button onClick={() => { addNote() }} style={{ 
        backgroundColor: '#3498db',
        color: '#fff',
        padding: '0.8rem 1.5rem',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '2rem',
        cursor: 'pointer',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
      }}>Add Note</button>
      {notes.length > 0 ?
        <div>
          {notes.map(note =>
            <Note
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onUpdate={updateNote}
            />
          )}
        </div> :
        <p style={{ 
          color: '#2c3e50',
          fontWeight:'bold'}}>Please add notes</p>
      }
    </div>
  );
}

export default App;
