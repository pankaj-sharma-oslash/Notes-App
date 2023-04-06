self.addEventListener('install', (event) => {
  console.log("Installed")
})

self.addEventListener('activate', (event) => {
  console.log("Activated")
  self.clients.claim();
})

const request = indexedDB.open('notes-db', 2);

request.onupgradeneeded = event => {
  const db = event.target.result;
  db.createObjectStore('notes-data');
};

self.addEventListener("fetch", (event) => {
  if (event.request.method === 'GET' && event.request.url.includes('/api-call')) {
    console.log('Fetch HANDLER')
    event.respondWith(handleAllNotesFetch(event));
  }
  if (event.request.method === 'POST' && event.request.url.includes('/single-note')) {
    console.log('Fetch HANDLER for Single Note')
    event.respondWith(handleSingleNoteFetch(event));
  }
  if (event.request.method === 'POST' && event.request.url.includes('/add-note')) {
    console.log('Fetch HANDLER for Add Note')
    event.respondWith(addNoteHandler(event))
  }
  if (event.request.method === 'POST' && event.request.url.includes('/delete-note')) {
    console.log('Fetch HANDLER for Delete Note')
    event.respondWith(deleteNoteHandler(event))
  }
  if (event.request.method === 'POST' && event.request.url.includes('/edit-note')) {
    console.log('Fetch HANDLER for Edit Note')
    event.respondWith(editNoteHandler(event))
  }
});

const url = "https://notes-worker.jangidp318.workers.dev/"

const handleAllNotesFetch = async (event) => {
  const db = request.result
  const data = []
  const tx = db.transaction(['notes-data'])
  const getAllKeys = tx.objectStore('notes-data').getAllKeys()

  const promise = new Promise((resolve, reject) => {
    getAllKeys.onsuccess = (event) => {
      const allKeys = event.target.result
      let completedCount = 0

      allKeys.forEach((key) => {
        const getNote = tx.objectStore('notes-data').get(key)

        getNote.onsuccess = (event) => {
          const note = event.target.result
          data.push({ id: key, title: note.title, description: note.description })
          completedCount++

          if (completedCount === allKeys.length) {
            const response = new Response(JSON.stringify(data), {
              headers: {
                'Content-type': 'application/json'
              }
            })

            resolve(response)
          }
        }

        getNote.onerror = (event) => {
          reject(event.target.error)
        }
      })
    }

    getAllKeys.onerror = (event) => {
      reject(event.target.error)
    }
  })

  return promise
}


const editNoteOnKV = async (action) => {
  const resp = await fetch('https://notes-worker.jangidp318.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ action })
  })
  if (resp.ok) {
    console.log("Note Edited Successfully On KV")
  }
}

const editNoteHandler = async (event) => {
  console.log("I am edit note handler")
  const { action } = await event.request.json()
  console.log("Data from Input => ", action)
  const db = request.result
  const tx = db.transaction('notes-data', 'readwrite');
  const result = tx.objectStore('notes-data').put({ title: action.value.title, description: action.value.description }, action.key);
  const promise = new Promise((resolve, reject) => {
    result.onsuccess = () => {
      console.log('Data edited on the object store.');
      editNoteOnKV(action)
      const response = new Response(JSON.stringify({ "message": "Edited Note in IndexedDB" }), {
        headers: {
          'Content-type': 'application/json'
        },
      });
      resolve(response)
    };
    result.onerror = (event) => {
      console.error("Error in indexedDB request", event.target.error);
      reject(event.target.error);
    }
  })
  return promise
}

const addNoteToKV = async (action) => {
  const resp = await fetch('https://notes-worker.jangidp318.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ action })
  })
  if (resp.ok) {
    console.log("Note Added Successfully to KV")
  }
}


const addNoteHandler = async (event) => {
  console.log("I am add note handler")
  const { action } = await event.request.json()
  console.log("Data from Input => ", action)
  const db = request.result
  const tx = db.transaction('notes-data', 'readwrite');
  const result = tx.objectStore('notes-data').put({ title: action.value.title, description: action.value.description }, action.key);
  const promise = new Promise((resolve, reject) => {
    result.onsuccess = () => {
      console.log('Data added to the object store successfully.');
      addNoteToKV(action)
      const response = new Response(JSON.stringify({ "message": "Added Note in IndexedDB" }), {
        headers: {
          'Content-type': 'application/json'
        },
      });
      resolve(response)
    };
    result.onerror = (event) => {
      console.error("Error in indexedDB request", event.target.error);
      reject(event.target.error);
    }
  })
  return promise
}

const deleteNoteFromKV = async (action) => {
  const resp = await fetch('https://notes-worker.jangidp318.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ action })
  })
  if (resp.ok) {
    console.log("Note Added Successfully to KV")
  }
}

const deleteNoteHandler = async (event) => {
  console.log("I am delete note handler")
  const { action } = await event.request.json()
  console.log("Data from Input => ", action)
  const db = request.result
  const tx = db.transaction('notes-data', 'readwrite');
  const result = tx.objectStore('notes-data').delete(action.key)
  const promise = new Promise((resolve, reject) => {
    result.onsuccess = () => {
      console.log('Note removed from object store successfully.');
      const response = new Response(JSON.stringify({ "message": "Note removed from in IndexedDB" }), {
        headers: {
          'Content-type': 'application/json'
        },
      });
      resolve(response)
    };
    result.onerror = (event) => {
      console.error("Error in indexedDB request", event.target.error);
      reject(event.target.error);
    }
  })
  deleteNoteFromKV(action)
  return promise

}



const fetchFromKV = async (key) => {
  console.log("Fetching from KV.....")
  const resp = await fetch('https://notes-worker.jangidp318.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ "action": { "type": "SINGLENOTE", "key": key } })
  })
  if (resp.ok) {
    const data = await resp.json()
    console.log("data =>", data)
    if (data.message === "Note not Found") {
      return new Response(JSON.stringify({ "message": "Note not Found" }), {
        headers: {
          'Content-type': 'application/json'
        },
        status: 404
      })
    }

    //Putting data in indexedDB from KV
    const db = request.result
    const tx = db.transaction('notes-data', 'readwrite');
    const result = tx.objectStore('notes-data').put({ title: data.title, description: data.description }, data.id);
    result.onsuccess = () => {
      console.log('Data added to the object store successfully.');

    };
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-type': 'appliaciton/json'
      },
    })
  } else {
    return new Response(JSON.stringify({ "message": "Note not Found" }), {
      headers: {
        'Content-type': 'application/json'
      },
      status: 404
    });
  }
}


const handleSingleNoteFetch = async (event) => {
  const { key } = await event.request.json()
  console.log("key===>", key)
  const db = request.result
  const tx = db.transaction(['notes-data'])
  const resFromIndexedDB = tx.objectStore('notes-data').get(key)
  const promise = new Promise((resolve, reject) => {
    resFromIndexedDB.onsuccess = (evt) => {
      const note = evt.target.result;
      console.log("Note ==>", note)
      if (note) {
        const { title, description } = note;
        const response = new Response(JSON.stringify({
          id: key,
          title,
          description
        }), {
          headers: {
            'Content-type': 'application/json'
          }
        })
        resolve(response)
      } else {
        const kvResponse = fetchFromKV(key)
        resolve(kvResponse)
      }
      resFromIndexedDB.onerror = (event) => {
        console.error("Error in getting note", event.target.error);
        reject(event.target.error);
      }
    }
  });
  return promise
}

