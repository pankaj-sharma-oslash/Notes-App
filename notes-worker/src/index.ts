interface NotesDataType {
	id: string,
	title: string,
	description: string
}


declare let NOTES: KVNamespace

addEventListener("fetch", (event: FetchEvent) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {

	const corsHeaders: { [key: string]: string } = {
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Origin': '*'
	}

	const getKVData = async (): Promise<Array<any>> => {
		let notesData: Array<NotesDataType> = [];
		try {
			  console.log("===>getKV if condition")
			  const keys = await NOTES.list();
			  console.log('The keys are', )
			  if (keys.keys) {
				for (const key of keys.keys) {
				  const value = await NOTES.get(key.name);
				  if (value) {
					notesData.push({id: key.name,...JSON.parse(value)});
				  }
				}
			}
		} catch(err){
			console.log('The error is ', err)
		}
		
		return notesData;
	  }

	const addNotes = async (key: string, value: any): Promise<Response> => {
		await NOTES.put(key, JSON.stringify(value))
		const notesData = await getKVData();
		return new Response(JSON.stringify(notesData), {
			headers: {
				"Content-Type": "application/json",
			...corsHeaders
			},
		});
	}

	const deleteNotes = async (key: string): Promise<Response> => {
		await NOTES.delete(key)
		const notesData = await getKVData();
		return new Response(JSON.stringify(notesData), {
			headers: {
				"Content-Type": "application/json",
				...corsHeaders
			},
		});
	}

	const getSingleNote = async (key: string): Promise<Response>  => {
		const data = await NOTES.get(key) as string | null;
		if(data) {
			const parseedData = JSON.parse(data)
			let notesData = {
				id: key,
				title: parseedData.title,
				description: parseedData.description
			}
			return new Response(JSON.stringify(notesData), {
				headers: {
					"Content-type": "application/json",
					...corsHeaders
				}
			})
		} else {
			return new Response(JSON.stringify({"message":"Note not Found"}), {
				headers: {
					"Content-type": "application/json",
					...corsHeaders
				}
			})
		}
		
	}

	const editNotes = async (key: string, value: any): Promise<Response> => {
		let data = await NOTES.get(key) as string | null;
		if (data) {
			const parsedData = JSON.parse(data);
			parsedData.title = value.title
			parsedData.description = value.description
			await NOTES.put(key, JSON.stringify(parsedData));
			const notesData = await getKVData();
			return new Response(JSON.stringify(notesData), {
				headers: {
					"Content-Type": "application/json",
					...corsHeaders
				},
			});
		} else {
			return new Response("Note not found", {
				headers: { "Content-Type": "text/plain" },
			});
		}
	}

	if (request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				...corsHeaders
			}
		})
	}

	if(request.method === 'GET') {
		const notesData = await getKVData();
		return new Response(JSON.stringify(notesData), {
			headers: {
				"Content-Type": "application/json",
				...corsHeaders
			},
		});
	}

	if (request.method === 'POST') {
		const { action }: {action: { type: string, key: string, value: {}}} = await request.json();

		switch (action.type) {
			case 'ADD':
				return addNotes(action.key, action.value);
			case 'DELETE':
				return deleteNotes(action.key);
			case 'EDIT':
				return editNotes(action.key, action.value);
			case 'SINGLENOTE':
				return getSingleNote(action.key)
			default:
				return new Response("Invalid action", {
					headers: {
						"Content-Type": "text/plain",
						...corsHeaders
					},
				});
		}
	} else {
		const notesData = await getKVData();
		return new Response(JSON.stringify(notesData), {
			headers: {
				"Content-Type": "application/json",
				...corsHeaders
			},
		});

	}
}
