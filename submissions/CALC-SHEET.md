# Part 1: Understanding the Project Structure

## Explore Design Patterns

### Singleton Pattern:

The **DocumentHolder** class implements a singleton-like pattern for managing SpreadSheetController instances. Each document is represented by a single SpreadSheetController instance, stored in a Map. This ensures that there's only one controller per document.

The DocumentHolder is instantiated once and used throughout the server to manage all documents.

### Observer Pattern:

The Observer pattern is implemented in the client-side code to handle real-time updates from the server. This is evident in the SpreadSheet component:

```typescript
useEffect(() => {
  const intervalId = setInterval(() => {
    updateDisplayValues();
  }, 50);

  return () => clearInterval(intervalId);
}, [formulaValue, resultValue]);
```

This useEffect hook sets up an interval to periodically fetch updates from the server, effectively observing changes in the spreadsheet data.

### Model-View-Controller (MVC) Pattern:

The application follows an MVC-like structure

#### Model:

SpreadSheetController class manages the data and business logic.

```typescript
export class SpreadSheetController {
  /** The memory for the sheet */
  private _memory: SheetMemory;
  private _contributingUsers: Map<string, ContributingUser> = new Map<string, ContributingUser>();
  private _cellsBeingEdited: Map<string, string> = new Map<string, string>();
  private _calculationManager: CalculationManager;
  private _errorOccurred: string = '';
  /**
   * constructor
   * */
  constructor(columns: number, rows: number) {
    this._memory = new SheetMemory(columns, rows);
    this._calculationManager = new CalculationManager();
  }
  // ... other methods
}
```

DocumentHolder manages multiple SpreadSheetController instances, acting as a higher-level model.

Classes like SheetMemory, CalculationManager, and ContributingUser (which are referenced but not fully shown) are also part of the model layer, each handling specific aspects of the spreadsheet's data and logic.

#### View:

React components, like the SpreadSheet component, serve as the View in the MVC pattern. They are responsible for rendering the user interface and presenting data to the user.

The React components interact with the Model (represented by SpreadSheetClient and ultimately SpreadSheetController) to fetch and update data. For instance:

```typescript
function SpreadSheet({ documentName, spreadSheetClient }: SpreadSheetProps) {
  const [formulaString, setFormulaString] = useState(spreadSheetClient.getFormulaString())
  const [resultString, setResultString] = useState(spreadSheetClient.getResultString())
  const [cells, setCells] = useState(spreadSheetClient.getSheetDisplayStringsForGUI());
  const [statusString, setStatusString] = useState(spreadSheetClient.getEditStatusString());
  const [currentCell, setCurrentCell] = useState(spreadSheetClient.getWorkingCellLabel());
  const [currentlyEditing, setCurrentlyEditing] = useState(spreadSheetClient.getEditStatus());
  const [userName, setUserName] = useState(window.sessionStorage.getItem('userName') || "");
  const [serverSelected, setServerSelected] = useState("localhost");


  function updateDisplayValues(): void {
    spreadSheetClient.userName = userName;
    spreadSheetClient.documentName = documentName;
    setFormulaString(spreadSheetClient.getFormulaString());
    setResultString(spreadSheetClient.getResultString());
    setStatusString(spreadSheetClient.getEditStatusString());
    setCells(spreadSheetClient.getSheetDisplayStringsForGUI());
    setCurrentCell(spreadSheetClient.getWorkingCellLabel());
    setCurrentlyEditing(spreadSheetClient.getEditStatus());

  }

  // ... other code

  return (
    <div>
      {/* UI components */}
    </div>
  );
};
```

#### Controller:

Server-side Controller:

The DocumentServer does act as a controller, handling HTTP requests and coordinating between the client and the server-side model (DocumentHolder and SpreadSheetController).

Client-side Controller:

```typescript
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
    console.log('PUT /documents/:name');
    const name = req.params.name;
    // get the userName from the body
    console.log(`PUT /documents/:name ${name}`);
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();

    if (documentNames.indexOf(name) === -1) {
        console.log(`Document ${name} not found, creating it`);
        documentHolder.createDocument(name, 5, 8, userName);
    }
    // get the document
    const document = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(document);
});
```

#### Client-side Controller:

The SpreadSheetClient class also acts as a controller on the client side, This class manages the communication between the React components and the server, handling API calls and local state updates.

```typescript
    public addToken(token: string): void {
        const body = {
            "userName": this._userName,
            "token": token
        };

        const requestAddTokenURL = `${this._baseURL}/document/addtoken/${this._documentName}`;
        fetch(requestAddTokenURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {

                return response.json() as Promise<DocumentTransport>;
            }
            ).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });
    }
```

SpreadSheetController as a Model-Controller Hybrid:

The SpreadSheetController class, while primarily acting as a model, also has some controller-like responsibilities. This class manages the business logic and state of the spreadsheet, but also controls how operations are performed on the data.

```typescript
addToken(token: string, user: string): void {
    // is the user editing a cell
    const userData = this._contributingUsers.get(user)!;
    if (!userData.isEditing) {
      return;
    }

    // add the token to the formula
    userData.formulaBuilder.addToken(token);
    let cellBeingEdited = this._contributingUsers.get(user)?.cellLabel;


    let cell = this._memory.getCellByLabel(cellBeingEdited!);
    cell.setFormula(userData.formulaBuilder.getFormula());
    this._memory.setCellByLabel(cellBeingEdited!, cell);

    this._calculationManager.evaluateSheet(this._memory);
  }
```

# Part 2: Analyzing the Backend (NodeJS)

## Examine the RESTful API

### CRUD

The CRUD (Create, Read, Update, Delete) operations in this spreadsheet application are primarily handled by the **DocumentHolder** class(is this because we do not have a database in this project?), which manages multiple SpreadSheetController instances.

#### Create:
New documents are created when the application loads existing JSON files from the document folder:

**POST /documents/create/**

This endpoint creates a new document. The client sends a userName, and if the document name doesn't already exist on the server, the backend creates a new document.

```typescript
app.post('/documents/create/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  console.log('create document');
  let document = documentHolder.createDocument(documentName, userName);
  if (!document) {
    res.status(400).send('document already exists');
    return;
  }
  res.status(200).json(document);
});
```

#### Read DATA
**GET /documents**: Returns a list of all document names.
**: Retrieves the content of a specific document based on the document name and the user's details.

```typescript
app.get('/documents', (req: express.Request, res: express.Response) => {
  const documents = documentHolder.getDocuments();
  res.status(200).json(documents);
});

app.put('/documents/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  console.log('get document');
  let document = documentHolder.getDocument(documentName, userName);
  res.status(200).json(document);
});
```

#### Update Data
PUT /documents/ Updates a document's content or creates a new document if it doesn't exist. If the document exists, it retrieves it; otherwise, it creates a new one.
PUT /document/addcell/ :Adds a new cell to the document.

```typescript
app.put('/documents/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  console.log('get document');
  let document = documentHolder.getDocument(documentName, userName);
  res.status(200).json(document);
});
```

```typescript
app.put('/document/addtoken/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  let cellName = req.body.cellName;
  let token = req.body.token;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  if (!cellName) {
    res.status(400).send('cellName is required');
    return;
  }
  if (!token) {
    res.status(400).send('token is required');
    return;
  }
  console.log('add token');
  let result = documentHolder.addToken(documentName, userName, cellName, token);
  res.status(200).json(result);
});
```

#### Delete Data
PUT /document/clear/formula/ : Clears the formula data for a document.
PUT /document/removetoken/: Removes a token from a specific document.
How the server validates and processes client requests before responding.

### Validation:

Before processing requests, the server checks for required fields such as userName in the request body. If the userName is missing, the server responds with an HTTP 400 error, indicating that the request is invalid.

```typescript
app.put('/documents/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  // ... rest of the code
});
```

### Processing Flow:

Each API endpoint calls methods in the DocumentHolder class to perform the necessary business logic, such as creating documents, editing cells, or managing tokens.

If the requested document does not exist, the backend automatically creates it. Operations like creating and updating documents are tied to the user through the userName parameter, allowing personalized document access.

## Real-Time Communication

If the project includes real-time communication (e.g., using WebSockets), investigate:
How the client and server establish real-time connections.
How messages are exchanged between the client and server, and what kind of data is sent.
I did not find any real-time communication mechanisms, such as WebSockets or Socket.IO, which are typically used for establishing persistent, bidirectional connections between the client and server for real-time updates. However, I did find standard HTTP-based RESTful API routes using Express.js, which handle document-related operations like creating, reading, updating, and deleting documents through individual GET, POST, and PUT requests.

This means the current project is using a traditional request-response model, where the client sends requests to the server and receives a response, rather than having a persistent connection for continuous data exchange.

## User Management

### User Authentication:
The current backend implementation does not use advanced authentication mechanisms such as **JWT** (JSON Web Tokens), **OAuth**, or session-based authentication. Instead, the backend checks for the presence of a userName in the request body to proceed with the request. This is evident from the following code snippet:

```typescript
if (!userName) {
  res.status(400).send('userName is required');
  return;
}
```

In this case, the backend simply verifies if the userName is present in the request body and does not involve more sophisticated authentication measures like verifying a token or handling user sessions securely.

### Backend Differentiate:
The backend does not currently implement any logic for differentiating between user types (e.g., admin, regular user) or granting different levels of access based on user roles. There is no attribute or logic in the code to check user roles or permissions. The system processes requests in a uniform way for all users, provided that they supply a valid userName.Typically, a role-based access control (RBAC) system would check for user roles (e.g., user.role === 'admin') and allow or deny access based on those roles. However, such a mechanism is not present in this code.

### Mechanisms to Secure Sensitive User Data:
In the current backend implementation, there is no explicit mechanism for securing sensitive user data. The userName is transmitted in plain text within the request body:

```typescript
let userName = req.body.userName;
```

There is no evidence of encryption, tokenization, or other secure transmission methods (like HTTPS or data encryption) being used to protect sensitive information. Additionally, sensitive data such as user passwords or tokens are not managed, stored, or protected by cryptographic measures such as hashing or encryption.Without these security mechanisms, the backend is vulnerable to common security risks such as man-in-the-middle attacks or unauthorized access.

## Middleware and Error Handling

### Middleware:

The server uses basic middleware for logging and CORS:

```typescript
// Add CORS middleware
app.use(cors());

// Add middleware to parse the body of the request
app.use(express.json());

// Add middleware to log the requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

This middleware logs incoming requests when in debug mode.

### Authentication and Session Management

There is no robust authentication or session management implemented. The server relies on a userName parameter passed in request bodies, but there's no verification of this user identity:

```typescript
app.put('/documents/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  console.log('get document');
  let document = documentHolder.getDocument(documentName, userName);
  res.status(200).json(document);
});
```

### Data Validation:

Basic data validation is performed, primarily checking for the presence of required fields:

```typescript
app.put('/document/addtoken/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  let cellName = req.body.cellName;
  let token = req.body.token;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  if (!cellName) {
    res.status(400).send('cellName is required');
    return;
  }
  if (!token) {
    res.status(400).send('token is required');
    return;
  }
  console.log('add token');
  let result = documentHolder.addToken(documentName, userName, cellName, token);
  res.status(200).json(result);
});
```

# Part 3: Analyzing the Frontend (React TypeScript)

## Multi-Screen Navigation

### Routing Set Up:

Based on the provided code, the application does not follow a traditional server-side rendering approach where each URL change triggers a new server request for a full HTML document. Instead, it uses a client-side routing approach with manual URL manipulation and page reloads.

In App.tsx: the resetURL function is set to handle navigation between different screens by updating the URL with a new document name and then reloading the page.

```typescript
const resetURL = (documentName: string) => {
  window.history.pushState({}, '', `/${documentName}`);
  window.```typescript
const resetURL = (documentName: string) => {
  window.history.pushState({}, '', `/${documentName}`);
  window.location.reload();
};
```

```typescript
useEffect(() => {
  const path = window.location.pathname;
  const parts = path.split('/');
  if (parts.length > 1) {
    const docName = parts[1];
    setDocumentName(docName);
  }
}, []);
```

```typescript
const handleSetDocument = (documentName: string) => {
  setDocumentName(documentName);
  resetURL(documentName);
};
```

However, this approach has several drawbacks:

1. It causes full-page reloads, which can be slow and disruptive to the user experience.

2. It doesn't leverage React's ability to update components efficiently without reloading the page.

3. It's more prone to errors and harder to maintain as the application grows.

### Handle Protected Routes

This application does not implement protected routes. The app only uses a simple username-based authentication stored in session storage.

1. The user enters their username in the input field provided by the getUserLogin function in the loginPageComponent.

2. When the user presses Enter, the application stores the username in the browser's session storage, updates the local state , and sets the username in the spreadSheetClient object

3. When making requests to the server, the username is included in the request body.

4. The server uses the username to associate actions with specific users, but doesn't perform any actual authentication:

In DocumentServer.ts: app.put('/documents/:name', (req: express.Request, res: express.Response)

```typescript
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
  const { userName } = req.body;
  const { name } = req.params;
  
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  
  // Process the request...
});
```

5. The logout process simply clears the username from session storage and reloads the page in LoginPageComponent.tsx

```typescript
const handleLogout = () => {
  window.sessionStorage.removeItem('userName');
  window.location.reload();
};
```

## State Management

The application manages state across different screens and components primarily through a combination of React's useState hook, the SpreadSheetClient class, and browser session storage.

1. SpreadSheetClient:

This class acts as a central state manager for the application. It holds important data like the document name, user name, and document content. Components interact with this SpreadSheetClient to get and set data.

2. App Component

The App component manages the high-level state of which view to display (login page or spreadsheet). It uses the useState hook to keep track of the current document name.

```typescript
const [documentName, setDocumentName] = useState<string>('');
```

3. LoginPageComponent

This component manages the state of the user name and the list of available documents. It uses useState hooks and also interacts with the SpreadSheetClient to fetch and update data. For instance, it uses useEffect hooks with short intervals to frequently update the state from the SpreadSheetClient, ensuring that the UI reflects the latest data.

```typescript
const [documents, setDocuments] = useState<string[]>([]);
const [userName, setUserName] = useState<string>('');

useEffect(() => {
  const intervalId = setInterval(() => {
    const docs = spreadSheetClient.getDocuments();
    setDocuments(docs);
  }, 250);

  return () => clearInterval(intervalId);
}, []);
```

4. SpreadSheet Component

This component manages the state of the spreadsheet itself, including the current formula, result, cell values, and editing status. It uses multiple useState hooks and frequently updates its state by calling the SpreadSheetClient.

```typescript
const [formulaValue, setFormulaValue] = useState<string>('');
const [resultValue, setResultValue] = useState<string>('');
const [cellsValues, setCellsValues] = useState<string[][]>([]);
const [currentCell, setCurrentCell] = useState<string>('');
const [currentlyEditing, setCurrentlyEditing] = useState<boolean>(false);
```

5. Session Storage

The application uses browser session storage to persist the user name across page reloads: window.sessionStorage.setItem('userName', userName) (Also in LoginPageComponent.tsx file, function getUserLogin())

Because session storage persists data for the duration of the browser session (including page reloads), the username remains available even if the user refreshes the page or navigates away and back to the application.

```typescript
window.sessionStorage.setItem('userName', userName);
```

## API Interaction

### API Calls, Data Processing, and UI Update

In this project, API interactions are primarily handled in the **SpreadSheetClient** class, which acts as an intermediary between the frontend and the backend. The API calls are made using the **fetch** API. For example, in the getDocument method:

```typescript
public async getDocument(userName: string): Promise<boolean> {
  const getDocumentEndpoint = `${this._baseURL}/documents/`;
  const body = {
    userName: userName,
    documentName: this._documentName
  };

  try {
    const response = await fetch(getDocumentEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const document = await response.json();
      this._updateDocument(document);
      return true;
    } else {
      this._errorMessage = `Failed to get document: ${response.status} ${response.statusText}`;
      return false;
    }
  } catch (error) {
    this._errorMessage = `Failed to get document: ${error}`;
    return false;
  }
}
```

This method makes a PUT request to the server, sending the username in the request body. After receiving the response from the server, the data is typically processed in the .then() blocks of the fetch promises. It first parses the response as JSON, then calls this._updateDocument(document) to update the client's internal state with the received document data, which is the data processing procedure:

```typescript
private _updateDocument(document: DocumentTransport): void {
  this._document = document;

  // Reset the error flag and message
  this._errorOccurred = false;
  this._errorMessage = '';

  // Extract the cell values from the document
  const cells = new Map<string, string>();
  const formula = new Map<string, string>();

  for (let cellName in document.cells) {
    cells.set(cellName, document.cells[cellName].value);
    formula.set(cellName, document.cells[cellName].formula);
  }

  // Update the internal state
  this._cells = cells;
  this._formula = formula;
  this._currentCell = document.currentCell;
  this._isEditing = document.isEditing;
}
```

This method updates the internal state of the **SpreadSheetClient** with the new data received from the server.

The processed data is then used to update the UI. This is primarily done in the SpreadSheet component, which uses React's **useState** hook to manage state and trigger re-renders. The updateDisplayValues function in the SpreadSheet component is responsible for updating various pieces of state with the latest data from the SpreadSheetClient:

```typescript
const updateDisplayValues = (): void => {
  setFormulaValue(spreadSheetClient.getFormulaString());
  setResultValue(spreadSheetClient.getResultString());
  setCellsValues(spreadSheetClient.getSheetDisplayStrings());
};
```

The SpreadSheet component uses a **useEffect** hook to periodically call updateDisplayValues, ensuring that the UI stays in sync with the latest data from the server:

```typescript
useEffect(() => {
  const intervalId = setInterval(() => {
    updateDisplayValues();
  }, 50);

  return () => clearInterval(intervalId);
}, [formulaValue, resultValue]);
```

User interactions (like clicking a cell or a button) trigger functions that make API calls and then update the display. For example, the onCellClick function:

```typescript
const onCellClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  const cellLabel = event.currentTarget.getAttribute("cell-label") ?? "";
  spreadSheetClient.setCurrentCell(cellLabel);
  setCurrentCell(cellLabel);
  setCurrentlyEditing(false);
  updateDisplayValues();
};
```

This function handles cell clicks and updates the server accordingly.

In summary, the project uses a client-side class (**SpreadSheetClient**) to handle API interactions using the **fetch** API. The data received from these API calls is processed and stored in this client. The **React** components then use this client to retrieve data and update their state, which in turn updates the UI. Periodic polling ensures that the UI stays updated with the latest server data.

### Client Update

The client is updated to see other users' changes through a polling mechanism. This is implemented in the SpreadSheet component using a **useEffect** hook that periodically fetches the latest data.

#### Periodic Polling

In the SpreadSheet component, there's a **useEffect** hook that sets up an interval to call updateDisplayValues every 50 milliseconds.

```typescript
useEffect(() => {
  const intervalId = setInterval(() => {
    updateDisplayValues();
  }, 50);

  return () => clearInterval(intervalId);
}, [formulaValue, resultValue]);
```

#### Client-Side Update

The updateDisplayValues() function updates the client-side state with the latest data from the spreadSheetClient:

```typescript
const updateDisplayValues = (): void => {
  setFormulaValue(spreadSheetClient.getFormulaString());
  setResultValue(spreadSheetClient.getResultString());
  setCellsValues(spreadSheetClient.getSheetDisplayStrings());
};
```

#### Server Communication

The SpreadSheetClient class has a _timedFetch() method that periodically fetches the latest document data from the server:

```typescript
private async _timedFetch(): Promise<void> {
  if (this._timerID) {
    clearTimeout(this._timerID);
  }

  await this.getDocument(this._userName);

  this._timerID = setTimeout(() => {
    this._timedFetch();
  }, 100);
}
```

#### Document Update

When new document data is received from the server, the _updateDocument() method in SpreadSheetClient updates the client-side representation of the document:

```typescript
private _updateDocument(document: DocumentTransport): void {
  this._document = document;

  // Reset the error flag and message
  this._errorOccurred = false;
  this._errorMessage = '';

  // Extract the cell values from the document
  const cells = new Map<string, string>();
  const formula = new Map<string, string>();

  for (let cellName in document.cells) {
    cells.set(cellName, document.cells[cellName].value);
    formula.set(cellName, document.cells[cellName].formula);
  }

  // Update the internal state
  this._cells = cells;
  this._formula = formula;
  this._currentCell = document.currentCell;
  this._isEditing = document.isEditing;
}
```

#### Contributing Users

The _updateDocument() method also updates information about contributing users, including which cells they are editing:

```typescript
for (const [userName, user] of Object.entries(document.contributingUsers)) {
  this._contributingUsers.set(userName, user);
}
```

#### Server-Side Tracking

On the server side, the SpreadSheetController class keeps track of which users are editing which cells:

```typescript
public setEditStatus(userName: string, cell: string, isEditing: boolean): void {
  const user = this._contributingUsers.get(userName) || { userName, cell: '', isEditing: false };
  user.cell = cell;
  user.isEditing = isEditing;
  this._contributingUsers.set(userName, user);
}
```

Document Container

The documentContainer() method in SpreadSheetController prepares a container with all the necessary information about the document, including contributing users:

```typescript
public documentContainer(): DocumentTransport {
  return {
    cells: this._sheetMemory.getCellsForTransport(),
    formula: this._getFormulaString(),
    result: this._getResultString(),
    currentCell: this.getCurrentCell(),
    isEditing: this._isEditing,
    contributingUsers: Object.fromEntries(this._contributingUsers),
  };
}
```

This combination of periodic polling, server-side tracking of user edits, and client-side updates allows the client to see other users updating cells in near real-time. The client regularly fetches the latest document state, which includes information about which users are editing which cells, and updates its display accordingly.

## User Interface

### Display Real-time Data

#### User Editing Status

The SpreadSheet component uses the currentlyEditing state to determine whether a user is currently editing a cell. This affects the display of certain UI components:

```typescript
const [currentlyEditing, setCurrentlyEditing] = useState<boolean>(false);

// Later in the component
{currentlyEditing ? (
  <Button onClick={handleSaveEdit}>Save</Button>
) : (
  <Button onClick={handleStartEdit}>Edit</Button>
)}
```

When a user toggles the edit status, the UI is updated to reflect this change.

#### Real-time Cell Updates

The application uses a polling mechanism to fetch updates from the server every 50 milliseconds:

```typescript
useEffect(() => {
  const intervalId = setInterval(() => {
    updateDisplayValues();
  }, 50);

  return () => clearInterval(intervalId);
}, [formulaValue, resultValue]);
```

This ensures that the UI is frequently updated with the latest data from the server, including changes made by other users.

#### Cell Display

The SheetHolder component (which is rendered in the SpreadSheet component) displays the cells and their values. It receives props that determine how each cell should be displayed:

```typescript
<SheetHolder
  cellsValues={cellsValues}
  onClick={onCellClick}
  currentCell={currentCell}
  currentlyEditing={currentlyEditing}
/>
```

The cellsValues prop contains the latest cell data, including information about which users are editing which cells.

#### Contributing Users

The SpreadSheetController class keeps track of contributing users and which cells they are editing:

```typescript
private _contributingUsers: Map<string, ContributingUser>;
```

This information is then passed to the frontend through the documentContainer method, allowing the UI to display which users are editing which cells.

#### Error Messages

The application handles and displays error messages, such as when a user tries to edit a cell that's already being edited by another user:

```typescript
this._errorMessage = 'Cell is being edited by another user';
```

These error messages are then displayed to the user through the displayErrorMessage function in the SpreadSheet component:

```typescript
const displayErrorMessage = (message: string) => {
  setStatusString(message);
};
```

#### Formula and Result Display

The Formula component (rendered in the SpreadSheet component) displays the current formula and its result:

```typescript
<Formula formula={formulaValue} result={resultValue} />
```

This component is updated in real-time as the user edits the formula or when changes are fetched from the server.

In summary, while the application doesn't have distinct user roles, it does handle different user states (editing vs. viewing) and updates the UI in near real-time to reflect changes made by all users. The frequent polling mechanism ensures that all users see an up-to-date view of the spreadsheet, including which cells are being edited by other users.

### Cell Ownership

The cell ownership is displayed to users through a combination of client-side processing and UI rendering. Here's how it works:

#### Server-side tracking

The SpreadSheetController keeps track of contributing users and their editing status:

```typescript
public setEditStatus(userName: string, cell: string, isEditing: boolean): void {
  const user = this._contributingUsers.get(userName) || { userName, cell: '', isEditing: false };
  user.cell = cell;
  user.isEditing = isEditing;
  this._contributingUsers.set(userName, user);
}
```

#### Client-side processing

When the SpreadSheetClient receives updated document data, it processes the contributing users information in the _updateDocument method:

```typescript
private _updateDocument(document: DocumentTransport): void {
  // ... other updates ...

  // Update contributing users
  this._contributingUsers.clear();
  for (const [userName, user] of Object.entries(document.contributingUsers)) {
    this._contributingUsers.set(userName, user);
  }
}
```

Specifically, it uses the _getEditorString method to determine the editor for each cell:

```typescript
private _getEditorString(cellName: string): string {
  for (const [userName, user] of this._contributingUsers) {
    if (user.cell === cellName && user.isEditing) {
      return `|${userName}`;
    }
  }
  return '';
}
```

#### Preparing display data

The getSheetDisplayStringsForGUI method in SpreadSheetClient prepares the cell data for display, including the editing information:

```typescript
public getSheetDisplayStringsForGUI(): string[][] {
  const displayStrings: string[][] = [];
  for (let row = 0; row < this._rowCount; row++) {
    displayStrings[row] = [];
    for (let col = 0; col < this._columnCount; col++) {
      const cellName = `${String.fromCharCode(65 + col)}${row + 1}`;
      const cellValue = this._cells.get(cellName) || '';
      const editorString = this._getEditorString(cellName);
      displayStrings[row][col] = cellValue + editorString;
    }
  }
  return displayStrings;
}
```

This method appends the editor's name to each cell's value, separated by a "|" character.

#### UI Update

The SpreadSheet component in React periodically updates its state with the latest data from SpreadSheetClient:

```typescript
const updateDisplayValues = (): void => {
  setFormulaValue(spreadSheetClient.getFormulaString());
  setResultValue(spreadSheetClient.getResultString());
  setCellsValues(spreadSheetClient.getSheetDisplayStrings());
};

useEffect(() => {
  const intervalId = setInterval(() => {
    updateDisplayValues();
  }, 50);

  return () => clearInterval(intervalId);
}, [formulaValue, resultValue]);
```

#### Rendering

While not shown in the provided code snippets, the UI components (likely in a Cell or SheetHolder component) would then render this information. They would split the cell value string on the "|" character and display the editor's name if present.

In summary, cell ownership is tracked on the server, processed and formatted on the client, and then rendered in the UI. The "|" character is used as a delimiter to separate the cell value from the editor's name in the display string.

# Part 4: Frontend and Backend Interaction

## API Request-Response Flow

### The Data Flow Process:

#### Step 1: Frontend Interaction and Request Creation:

The user interacts with the interface, such as clicking to load a document, it triggers a function in LoginPageComponent.tsx that prepares an HTTP request.

```typescript
const handleLogin = async (userName: string) => {
  const success = await spreadSheetClient.getDocument(userName);
  if (success) {
    setUserName(userName);
    window.sessionStorage.setItem('userName', userName);
  } else {
    // Handle error
  }
};
```

#### Step 2: Sends the HTTP Request 

In SpreadSheetClient.ts, the getDocument method sends a request to the server and get the document from the server.

```typescript
public async getDocument(userName: string): Promise<boolean> {
  const getDocumentEndpoint = `${this._baseURL}/documents/`;
  const body = {
    userName: userName,
    documentName: this._documentName
  };

  try {
    const response = await fetch(getDocumentEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const document = await response.json();
      this._updateDocument(document);
      return true;
    } else {
      this._errorMessage = `Failed to get document: ${response.status} ${response.statusText}`;
      return false;
    }
  } catch (error) {
    this._errorMessage = `Failed to get document: ${error}`;
    return false;
  }
}
```

#### Step 3: Server Receives the Request

In DocumentServer.ts, the server handles the request:

```typescript
app.put('/documents/', (req: express.Request, res: express.Response) => {
  let userName = req.body.userName;
  let documentName = req.body.documentName;
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  if (!documentName) {
    res.status(400).send('documentName is required');
    return;
  }
  console.log('get document');
  let document = documentHolder.getDocument(documentName, userName);
  res.status(200).json(document);
});
```

#### Step 4: Processing the request:

In DocumentHolder.ts, the server processes the request to retrieve the document:

```typescript
public getDocument(documentName: string, userName: string): DocumentTransport {
  let document = this._documents.get(documentName);
  if (!document) {
    document = new SpreadSheetController(documentName);
    this._documents.set(documentName, document);
  }
  return document.documentContainer();
}
```

#### Step 5: Sending the Response:

The server sends the response back to the frontend In DocumentServer.ts.

```typescript
res.status(200).json(document);
```

#### Step 6: Frontend Receives the Response

In SpreadSheetClient.ts, the frontend processes the response:

```typescript
if (response.ok) {
  const document = await response.json();
  this._updateDocument(document);
  return true;
} else {
  this._errorMessage = `Failed to get document: ${response.status} ${response.statusText}`;
  return false;
}
```

#### Step 7: Interface Update

In App.tsx, It will update the webpage based on the new document data.

```typescript
const handleSetDocument = (documentName: string) => {
  setDocumentName(documentName);
  resetURL(documentName);
};
```

### Frontend Handle Errors Returned by the Server

In this project, it seems that the project does not have comprehensive error handling for server responses in the frontend. SpreadSheetClient.ts and LoginPageComponent.tsx both lack error handling parts.

## Real-Time Interaction (if applicable)

If the project includes real-time communication, investigate how the client and server communicate in real-time:

How are updates pushed from the server to the client, and how does the UI handle them?

The real-time interaction in this project is primarily achieved through periodic polling from the client to the server. Here's how it works:

### Periodic Polling

The client uses a timed fetch mechanism to periodically request updates from the server. This is implemented in the _timedFetch method of the SpreadSheetClient class:

```typescript
private async _timedFetch(): Promise<void> {
  if (this._timerID) {
    clearTimeout(this._timerID);
  }

  await this.getDocument(this._userName);

  this._timerID = setTimeout(() => {
    this._timedFetch();
  }, 100);
}
```

This method sets up a loop that calls getDocument every 100 milliseconds, ensuring that the client frequently checks for updates.

### Document Updates

When the client receives an updated document from the server, it processes the new data in the _updateDocument method:

```typescript
private _updateDocument(document: DocumentTransport): void {
  this._document = document;

  // Reset the error flag and message
  this._errorOccurred = false;
  this._errorMessage = '';

  // Extract the cell values from the document
  const cells = new Map<string, string>();
  const formula = new Map<string, string>();

  for (let cellName in document.cells) {
    cells.set(cellName, document.cells[cellName].value);
    formula.set(cellName, document.cells[cellName].formula);
  }

  // Update the internal state
  this._cells = cells;
  this._formula = formula;
  this._currentCell = document.currentCell;
  this._isEditing = document.isEditing;
}
```

This method updates the client's internal state with the new document data, including information about other users editing cells.

### UI Updates

The SpreadSheet component in React uses a **useEffect** hook to periodically call updateDisplayValues:

```typescript
useEffect(() => {
  const intervalId = setInterval(() => {
    updateDisplayValues();
  }, 50);

  return () => clearInterval(intervalId);
}, [formulaValue, resultValue]);
```

The updateDisplayValues function updates various state variables with the latest data from the SpreadSheetClient:

```typescript
const updateDisplayValues = (): void => {
  setFormulaValue(spreadSheetClient.getFormulaString());
  setResultValue(spreadSheetClient.getResultString());
  setCellsValues(spreadSheetClient.getSheetDisplayStrings());
};
```

### Handling User Edits

When a user starts editing a cell, the client sends a request to the server using the setEditStatus method:

```typescript
public async setEditStatus(cell: string, isEditing: boolean): Promise<boolean> {
  const setEditStatusEndpoint = `${this._baseURL}/document/edit-status`;
  const body = {
    userName: this._userName,
    documentName: this._documentName,
    cell: cell,
    isEditing: isEditing
  };

  try {
    const response = await fetch(setEditStatusEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return true;
    } else {
      this._errorMessage = `Failed to set edit status: ${response.status} ${response.statusText}`;
      return false;
    }
  } catch (error) {
    this._errorMessage = `Failed to set edit status: ${error}`;
    return false;
  }
}
```

This method sends a PUT request to the server to update the editing status of a cell.

### Displaying Other Users' Edits

The getSheetDisplayStringsForGUI method in SpreadSheetClient includes information about which users are editing which cells:

```typescript
public getSheetDisplayStringsForGUI(): string[][] {
  const displayStrings: string[][] = [];
  for (let row = 0; row < this._rowCount; row++) {
    displayStrings[row] = [];
    for (let col = 0; col < this._columnCount; col++) {
      const cellName = `${String.fromCharCode(65 + col)}${row + 1}`;
      const cellValue = this._cells.get(cellName) || '';
      const editorString = this._getEditorString(cellName);
      displayStrings[row][col] = cellValue + editorString;
    }
  }
  return displayStrings;
}
```

This method appends the name of the user editing each cell to the cell's display value, allowing the UI to show which cells are being edited by other users.

In summary, while this system doesn't use real-time technologies like WebSockets, it achieves near-real-time updates through frequent polling. The client regularly fetches the latest document state from the server, updates its internal state, and then triggers UI updates in React. This approach allows users to see changes made by other users with a small delay (up to 100ms in this case).