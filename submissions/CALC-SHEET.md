# CALC-SHEET project analysis

## Explore Design Patterns

### 1. Singleton Pattern:

The **DocumentHolder** class implements a singleton-like pattern for managing SpreadSheetController instances. Each document is represented by a single SpreadSheetController instance, stored in a Map.

### 2. Observer Pattern:

The Observer pattern is implemented in the client-side code to handle real-time updates from the server. This is evident in the SpreadSheet component:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    updateDisplayValues();
  }, 50);
  return () => clearInterval(interval);
}, []);
```

This useEffect hook sets up an interval to periodically fetch updates from the server, effectively observing changes in the spreadsheet data.

### 3. Model-View-Controller (MVC) Pattern:

#### Model:
SpreadSheetController class manages the data and business logic:

```typescript
class SpreadSheetController {
  private _sheetMemory: SheetMemory;
  private _calculationManager: CalculationManager;
  private _contributingUsers: ContributingUser;

  constructor(columns: number, rows: number) {
    this._sheetMemory = new SheetMemory(columns, rows);
    this._calculationManager = new CalculationManager(this._sheetMemory);
    this._contributingUsers = new ContributingUser();
  }

  // ... other methods
}
```

#### View:
React components, like the SpreadSheet component, serve as the View in the MVC pattern. They interact with the Model through the SpreadSheetClient:

```typescript
const [formulaString, setFormulaString] = useState(formula);
const [resultString, setResultString] = useState(result);

useEffect(() => {
  const fetchData = async () => {
    const formula = await spreadSheetClient.getFormulaString();
    const result = await spreadSheetClient.getResultString();
    setFormulaString(formula);
    setResultString(result);
  };
  fetchData();
}, [spreadSheetClient]);
```

#### Controller:
The SpreadSheetClient class acts as a controller on the client side:

```typescript
export class SpreadSheetClient {
  private _serverHost: string = "";
  private _eventListeners: Map<string, ((event: SpreadSheetEvent) => void)[]> = new Map();

  constructor(serverHost: string) {
    this._serverHost = serverHost;
  }

  async getDocuments(): Promise<string[]> {
    const response = await fetch(`${this._serverHost}/documents`);
    const jsonResponse = await response.json();
    return jsonResponse.documents;
  }

  // ... other methods
}
```

## Analyzing the Backend (NodeJS)

### Examine the RESTful API

#### CRUD Operations

1. Create:
```typescript
app.post('/documents/create/', (req: express.Request, res: express.Response) => {
  const userName = req.body.userName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  const documentName = documentHolder.createDocument();
  res.status(201).send({ "documentName": documentName });
});
```

2. Read:
```typescript
app.get('/documents/:name', (req: express.Request, res: express.Response) => {
  const documentName = req.params.name;
  const userName = req.query.userName as string;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  const document = documentHolder.getDocument(documentName, userName);
  res.status(200).send(document);
});
```

3. Update:
```typescript
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
  const documentName = req.params.name;
  const userName = req.body.userName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  const document = documentHolder.getDocument(documentName, userName);
  if (!document) {
    res.status(404).send('Document not found');
    return;
  }
  // Update document logic here
  res.status(200).send(document);
});
```

### User Management

The current implementation uses a simple userName-based system:

```typescript
if (!userName) {
  res.status(400).send('userName is required');
  return;
}
```

## Analyzing the Frontend (React TypeScript)

### Multi-Screen Navigation

The application uses a client-side routing approach with manual URL manipulation:

```typescript
const resetURL = (documentName: string) => {
  window.history.pushState({}, '', `/${documentName}`);
  window.location.reload();
}
```

### State Management

The SpreadSheet component manages state using React hooks:

```typescript
const [formulaString, setFormulaString] = useState(formula);
const [resultString, setResultString] = useState(result);
const [currentCell, setCurrentCell] = useState<CellTransport | undefined>(undefined);
const [statusString, setStatusString] = useState(status);
```

### API Interaction

API calls are made using the fetch API in the SpreadSheetClient class:

```typescript
async getDocument(name: string, userName: string): Promise<Document> {
  const response = await fetch(`${this._serverHost}/documents/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName }),
  });
  const document = await response.json();
  this._updateDocument(document);
  return document;
}
```

### Real-Time Interaction

The client uses a polling mechanism to fetch updates:

```typescript
private _timedFetch(): void {
  const timedFetchFunction = async () => {
    try {
      await this.getDocument(this._documentName, this._userName);
      setTimeout(timedFetchFunction, 100);
    } catch (error) {
      console.log(error);
    }
  };
  timedFetchFunction();
}
```

## Frontend and Backend Interaction

### API Request-Response Flow

Let's trace the flow of data from the frontend to the backend and back:

1. Frontend Interaction and Request Creation:
   When a user interacts with the interface, such as clicking to load a document, it triggers a function in LoginPageComponent.tsx:

```typescript
const getDocument = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  const loadDocumentName = (event.target as HTMLButtonElement).value;
  if (loadDocumentName) {
    resetURL(loadDocumentName);
  }
};
```

2. Sending the HTTP Request:
   In SpreadSheetClient.ts, the getDocument method sends a request to the server:

```typescript
async getDocument(name: string, userName: string): Promise<Document> {
  const response = await fetch(`${this._serverHost}/documents/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName }),
  });
  const document = await response.json();
  this._updateDocument(document);
  return document;
}
```

3. Server Receives the Request:
   In DocumentServer.ts, the server handles the request:

```typescript
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
  const documentName = req.params.name;
  const userName = req.body.userName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  const document = documentHolder.getDocument(documentName, userName);
  if (!document) {
    res.status(404).send('Document not found');
    return;
  }
  // Update document logic here
  res.status(200).send(document);
});
```

4. Processing the Request:
   In DocumentHolder.ts, the server processes the request to retrieve the document:

```typescript
getDocument(documentName: string, userName: string): Document {
  let document = this._documents.get(documentName);
  if (!document) {
    document = this.createDocument();
    this._documents.set(documentName, document);
  }
  return document.getDocumentContainer(userName);
}
```

5. Sending the Response:
   The server sends the response back to the frontend in DocumentServer.ts:

```typescript
res.status(200).send(document);
```

6. Frontend Receives the Response:
   In SpreadSheetClient.ts, the frontend processes the response:

```typescript
private _updateDocument(document: DocumentTransport): void {
  this._documentName = document.documentName;
  this._sheetValues = document.sheetValues;
  this._currentCell = document.currentCell;
  this._formulaString = document.formulaString;
  this._resultString = document.resultString;
  this._contributingUsers = document.contributingUsers;
  this._error = document.error;
  this._statusString = document.statusString;
}
```

7. Interface Update:
   In App.tsx, it updates the webpage based on the new document data:

```typescript
function App() {
  const [documentName, setDocumentName] = useState(window.location.pathname.substring(1));

  useEffect(() => {
    const handlePopState = () => {
      setDocumentName(window.location.pathname.substring(1));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ... rest of the component
}
```

### Error Handling

While the project doesn't have comprehensive error handling, there are some basic error checks. For instance, in DocumentServer.ts:

```typescript
if (!userName) {
  res.status(400).send('userName is required');
  return;
}

if (!document) {
  res.status(404).send('Document not found');
  return;
}
```

However, these errors are not consistently handled on the frontend. This is an area that could be improved for better user experience and debugging.

## Real-Time Updates

The application uses a polling mechanism to achieve near real-time updates:

1. Periodic Polling:
   In SpreadSheetClient.ts:

```typescript
private _timedFetch(): void {
  const timedFetchFunction = async () => {
    try {
      await this.getDocument(this._documentName, this._userName);
      setTimeout(timedFetchFunction, 100);
    } catch (error) {
      console.log(error);
    }
  };
  timedFetchFunction();
}
```

2. UI Updates:
   In SpreadSheet.tsx:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    updateDisplayValues();
  }, 50);
  return () => clearInterval(interval);
}, []);
```

3. Handling User Edits:
   When a user edits a cell, the frontend sends an update to the server:

```typescript
async setEditStatus(
  userName: string,
  cell: string,
  editing: boolean
): Promise<EditorResponseType> {
  const response = await fetch(`${this._serverHost}/document/edit-status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName, cell, editing }),
  });
  return await response.json();
}
```

4. Displaying Other Users' Edits:
   The SpreadSheetClient prepares the display data including information about other users' edits:

```typescript
getSheetDisplayStringsForGUI(): string[][] {
  const displayStrings: string[][] = [];
  for (let row = 0; row < this._sheetValues.length; row++) {
    displayStrings[row] = [];
    for (let col = 0; col < this._sheetValues[row].length; col++) {
      const cellValue = this._sheetValues[row][col];
      const cellAddress = `${String.fromCharCode(65 + col)}${row + 1}`;
      const editor = this._getEditorString(cellAddress);
      displayStrings[row][col] = editor ? `${cellValue}|${editor}` : cellValue;
    }
  }
  return displayStrings;
}
```

This polling-based approach allows for near real-time updates without the need for WebSocket connections. However, it does come with the overhead of frequent HTTP requests, which might not be ideal for larger-scale applications or when dealing with a high number of concurrent users.

## Potential Improvements

1. **Error Handling**: Implement more comprehensive error handling on both frontend and backend, with meaningful error messages for users.

2. **Real-time Communication**: Consider implementing WebSocket connections for true real-time updates, which could be more efficient than polling for larger-scale use.

3. **Authentication**: Implement a more robust authentication system, possibly using JWT or session-based authentication.

4. **State Management**: For larger-scale applications, consider using a state management library like Redux or MobX for more predictable state updates.

5. **Code Splitting**: Implement code splitting to improve initial load times, especially if the application grows larger.

6. **Testing**: Add unit tests and integration tests to ensure reliability and ease of maintenance as the project grows.

These improvements could enhance the application's performance, security, and maintainability as it scales.
