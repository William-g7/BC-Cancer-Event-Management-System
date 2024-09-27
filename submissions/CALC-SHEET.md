# Understanding the Project Structure

## **Explore Design Patterns 1**

Identify and document at least three design patterns used in the client-server architecture. Examples of common patterns might include the following. Note that not 3dall of these are necessarily be in here, and there may be some that are in the code but not mentioned here.:

- **Singleton** for managing single instances of services.

- **Observer** or **Publisher-Subscriber** for handling real-time communication between the client and server.

- **Model-View-Controller (MVC)** for separating concerns in the backend.

- Provide examples of where and how these patterns are implemented in the code.

1. Singleton Pattern:

The **DocumentHolder** class implements a singleton-like pattern for managing SpreadSheetController instances. Each document is represented by a single SpreadSheetController instance, stored in a Map. This ensures that there's only one controller per document.

The DocumentHolder is instantiated once and used throughout the server to manage all documents.

2. Observer Pattern:

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

3. Model-View-Controller (MVC) Pattern:

The application follows an MVC-like structure

Model: SpreadSheetController class manages the data and business logic.

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

DocumentHolder manages multiple SpreadSheetController instances, acting as a higher-level model.

Classes like SheetMemory, CalculationManager, and ContributingUser (which are referenced but not fully shown) are also part of the model layer, each handling specific aspects of the spreadsheet's data and logic.

View:

React components, like the SpreadSheet component, serve as the View in the MVC pattern. They are responsible for rendering the user interface and presenting data to the user.

The React components interact with the Model (represented by SpreadSheetClient and ultimately SpreadSheetController) to fetch and update data. For instance:

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

Controller:

Server-side Controller:

The DocumentServer does act as a controller, handling HTTP requests and coordinating between the client and the model:

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

Client-side Controller:

The SpreadSheetClient class also acts as a controller on the client side, This class manages the communication between the React components and the server, handling API calls and local state updates.

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

SpreadSheetController as a Model-Controller Hybrid:

The SpreadSheetController class, while primarily acting as a model, also has some controller-like responsibilities. This class manages the business logic and state of the spreadsheet, but also controls how operations are performed on the data.

# Analyzing the Backend (NodeJS)

## **Examine the RESTful API 2**

Explore how the backend is structured to serve API requests. Identify key API endpoints that the client interacts with and document:

- How data is created, read, updated, and deleted (CRUD operations).

- How the server validates and processes client requests before responding.

### CRUD

The CRUD (Create, Read, Update, Delete) operations in this spreadsheet application are primarily handled by the **DocumentHolder** class(is this because we do not have a database in this project?), which manages multiple SpreadSheetController instances.

1. Create:
   New documents are created when the application loads existing JSON files from the document folder:

**POST /documents/create/**

This endpoint creates a new document. The client sends a userName, and if the document name doesn't already exist on the server, the backend creates a new document.

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

2. Read DATA
   **GET /documents**: Returns a list of all document names.
   **GET /documents/:name**: Retrieves the content of a specific document based on the document name and the user's details.

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

3. Update Data
   PUT /documents/
   Updates a document's content or creates a new document if it doesn't exist. If the document exists, it retrieves it; otherwise, it creates a new one.
   PUT /document/addcell/ :Adds a new cell to the document.

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

4. **Delete Data**
   PUT /document/clear/formula/ : Clears the formula data for a document.
   PUT /document/removetoken/: Removes a token from a specific document.
   How the server validates and processes client requests before responding.

1.**Validation**:

Before processing requests, the server checks for required fields such as userName in the request body. If the userName is missing, the server responds with an HTTP 400 error, indicating that the request is invalid.

```typescript
if (!userName) {
  res.status(400).send('userName is required');
  return;
}
```

2.**Processing Flow**:

Each API endpoint calls methods in the DocumentHolder class to perform the necessary business logic, such as creating documents, editing cells, or managing tokens.

If the requested document does not exist, the backend automatically creates it. Operations like creating and updating documents are tied to the user through the userName parameter, allowing personalized document access.

## **Real-Time Communication (if applicable) 3**

If the project includes real-time communication (e.g., using WebSockets), investigate:
How the client and server establish real-time connections.
How messages are exchanged between the client and server, and what kind of data is sent.
I did not find any real-time communication mechanisms, such as WebSockets or Socket.IO, which are typically used for establishing persistent, bidirectional connections between the client and server for real-time updates. However, I did find standard HTTP-based RESTful API routes using Express.js, which handle document-related operations like creating, reading, updating, and deleting documents through individual GET, POST, and PUT requests.

This means the current project is using a traditional request-response model, where the client sends requests to the server and receives a response, rather than having a persistent connection for continuous data exchange.

## **User Management 3**

(验证是否仅基于user name)

Analyze how the backend manages user authentication and roles. Specifically:

- How is user authentication handled (e.g., via JWT, OAuth)?
  The current backend implementation does not use advanced authentication mechanisms such as **JWT** (JSON Web Tokens), **OAuth**, or session-based authentication. Instead, the backend checks for the presence of a userName in the request body to proceed with the request. This is evident from the following code snippet:

```typescript
if (!userName) {
  res.status(400).send('userName is required');
  return;
}
```

In this case, the backend simply verifies if the userName is present in the request body and does not involve more sophisticated authentication measures like verifying a token or handling user sessions securely.

- How does the backend differentiate between user types (e.g., admin, regular user) and provide different levels of access?
  The backend does not currently implement any logic for differentiating between user types (e.g., admin, regular user) or granting different levels of access based on user roles. There is no attribute or logic in the code to check user roles or permissions. The system processes requests in a uniform way for all users, provided that they supply a valid userName.Typically, a role-based access control (RBAC) system would check for user roles (e.g., user.role === 'admin') and allow or deny access based on those roles. However, such a mechanism is not present in this code.

- What mechanisms are used to secure sensitive user data?
  In the current backend implementation, there is no explicit mechanism for securing sensitive user data. The userName is transmitted in plain text within the request body:

```typescript
body: JSON.stringify({ userName }),
```

There is no evidence of encryption, tokenization, or other secure transmission methods (like HTTPS or data encryption) being used to protect sensitive information. Additionally, sensitive data such as user passwords or tokens are not managed, stored, or protected by cryptographic measures such as hashing or encryption.Without these security mechanisms, the backend is vulnerable to common security risks such as man-in-the-middle attacks or unauthorized access.

**Recommendations for Improvement:**

1. **Implement Token-Based Authentication**: Use JWT or OAuth to handle user authentication. This will securely verify users by sending and validating a token with each request.

2. **Role-Based Access Control**: Differentiate between user roles (e.g., admin, regular user) by assigning roles to each user and controlling access to certain routes or functionalities based on their role.

3. **Encrypt Sensitive Data**: Use encryption (e.g., SSL/TLS) to secure sensitive data during transmission. Store sensitive data such as passwords using hashing algorithms like bcrypt.

## **Middleware and Error Handling** 2

Investigate how the backend uses middleware to handle tasks like:

- Authentication and session management.

- Data validation and error handling.

Document examples from the code that show how middleware simplifies request handling.

1. Middleware:

The server uses basic middleware for logging and CORS:

```typescript
app.use((req, res, next) => {
  if (req.url !== '/debug') {
    debug(`${req.method} ${req.url}`);
  }
  next();
});
```

This middleware logs incoming requests when in debug mode.

2. Authentication and Session Management:

There is no robust authentication or session management implemented. The server relies on a userName parameter passed in request bodies, but there's no verification of this user identity:

```typescript
if (!userName) {
  res.status(400).send('userName is required');
  return;
}
```

3 Data Validation:

Basic data validation is performed, primarily checking for the presence of required fields:

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

# Analyzing the Frontend (React TypeScript)

## **Multi-Screen Navigation** 3

Examine how the React app handles navigation between different screens and UI components:

- How is routing set up (e.g., using React Router)?

- How does the app handle protected routes (i.e., only allowing certain users to access specific pages)?

### Routing Set Up: 

Based on the provided code, the application does not follow a traditional server-side rendering approach where each URL change triggers a new server request for a full HTML document. Instead, it uses a client-side routing approach with manual URL manipulation and page reloads.

In App.tsx: the resetURL function is set to handle navigation between different screens by updating the URL with a new document name and then reloading the page.

```typescript
const resetURL = (documentName: string) => {
  window.history.pushState({}, '', `/${documentName}`);
  window.location.reload();
}
```

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

However, this approach has several drawbacks:

1. It causes full-page reloads, which can be slow and disruptive to the user experience.

2. It doesn't leverage React's ability to update components efficiently without reloading the page.

3. It's more prone to errors and harder to maintain as the application grows.

### Handle Protected Routes

This application does not implement protected routes. The app only uses a simple username-based authentication stored in session storage.

1. The user enters their username in the input field provided by the getUserLogin function in the loginPageComponent.

2. When the user presses Enter, the application stores the username in the browser's session storage, updates the local state, and sets the username in the spreadSheetClient object

```typescript
const getUserLogin = (): string => {
  const userName = window.sessionStorage.getItem('userName');
  if (userName) {
    return userName;
  }
  const userNameInput = prompt('Please enter your name');
  if (userNameInput) {
    window.sessionStorage.setItem('userName', userNameInput);
    return userNameInput;
  }
  return '';
};
```

3. When making requests to the server, the username is included in the request body.

4. The server uses the username to associate actions with specific users, but doesn't perform any actual authentication:

In DocumentServer.ts: app.put('/documents/:name', (req: express.Request, res: express.Response)

```typescript
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
  const documentName = req.params.name;
  const userName = req.body.userName;
  if (!userName) {
    res.status(400).send('userName# Understanding the Project Structure (Continued)

[Continuing from where we left off...]

is required');
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

5. The logout process simply clears the username from session storage and reloads the page in LoginPageComponent.tsx

```typescript
const handleLogout = () => {
  window.sessionStorage.removeItem('userName');
  window.location.reload();
};
```

## **State Management 2**

## Investigate how the app manages state across different screens and components:

- How is user state (e.g., authentication status, role) maintained and shared between components?

- Are tools like Redux or Context API used to manage global state? (no)

The application manages state across different screens and components primarily through a combination of React's useState hook, the SpreadSheetClient class, and browser session storage.

1. SpreadSheetClient:

This class acts as a central state manager for the application. It holds important data like the document name, user name, and document content. Components interact with this SpreadSheetClient to get and set data.

2. App Component

The App component manages the high-level state of which view to display (login page or spreadsheet). It uses the useState hook to keep track of the current document name.

```typescript
const [documentName, setDocumentName] = useState(window.location.pathname.substring(1));
```

3. LoginPageComponent

This component manages the state of the user name and the list of available documents. It uses useState hooks and also interacts with the SpreadSheetClient to fetch and update data. For instance, it uses useEffect hooks with short intervals to frequently update the state from the SpreadSheetClient, ensuring that the UI reflects the latest data.

```typescript
const [userName, setUserName] = useState(getUserLogin());
const [availableDocuments, setAvailableDocuments] = useState<string[]>([]);

useEffect(() => {
  const fetchDocuments = async () => {
    const documents = await spreadSheetClient.getDocuments();
    setAvailableDocuments(documents);
  };
  fetchDocuments();
  const interval = setInterval(fetchDocuments, 250);
  return () => clearInterval(interval);
}, [spreadSheetClient]);
```

4. SpreadSheet Component

This component manages the state of the spreadsheet itself, including the current formula, result, cell values, and editing status. It uses multiple useState hooks and frequently updates its state by calling the SpreadSheetClient.

```typescript
const [formulaString, setFormulaString] = useState(formula);
const [resultString, setResultString] = useState(result);
const [currentCell, setCurrentCell] = useState<CellTransport | undefined>(undefined);
const [statusString, setStatusString] = useState(status);
```

5. Session Storage

The application uses browser session storage to persist the user name across page reloads: window.sessionStorage.setItem('userName', userName) (Also in LoginPageComponent.tsx file, function getUserLogin())

Because session storage persists data for the duration of the browser session (including page reloads), the username remains available even if the user refreshes the page or navigates away and back to the application.

```typescript
const getUserLogin = (): string => {
  const userName = window.sessionStorage.getItem('userName');
  if (userName) {
    return userName;
  }
  // ... rest of the function
};
```

## **API Interaction**

Analyze how the frontend communicates with the backend:

- How are API calls made (e.g., using fetch, axios) and how is the data from the backend processed and displayed in the UI?

- How is the client updated so that they can see other users updating the cells.

### API Calls, Data Processing, and UI Update

In this project, API interactions are primarily handled in the **SpreadSheetClient** class, which acts as an intermediary between the frontend and the backend. The API calls are made using the **fetch** API. For example, in the getDocument method:

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

This method makes a PUT request to the server, sending the username in the request body. After receiving the response from the server, the data is typically processed in the .then() blocks of the fetch promises. It first parses the response as JSON, then calls this._updateDocument(document) to update the client's internal state with the received document data, which is the data processing procedure:

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

This method updates the internal state of the **SpreadSheetClient** with the new data received from the server.

The processed data is then used to update the UI. This is primarily done in the SpreadSheet component, which uses React's **useState** hook to manage state and trigger re-renders. The updateDisplayValues function in the SpreadSheet component is responsible for updating various pieces of state with the latest data from the SpreadSheetClient:

```typescript
const updateDisplayValues = useCallback(async () => {
  const formula = await spreadSheetClient.getFormulaString();
  const result = await spreadSheetClient.getResultString();
  const current = await spreadSheetClient.getCurrentCell();
  const status = await spreadSheetClient.getStatusString();
  setFormulaString(formula);
  setResultString(result);
  setCurrentCell(current);
  setStatusString(status);
}, [spreadSheetClient]);
```

The SpreadSheet component uses a **useEffect** hook to periodically call updateDisplayValues, ensuring that the UI stays in sync with the latest data from the server:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    updateDisplayValues();
  }, 50);
  return () => clearInterval(interval);
}, []);
```

User interactions (like clicking a cell or a button) trigger functions that make API calls and then update the display. For example, the onCellClick function:

```typescript
const onCellClick = (cell: string) => {
  setCellValue((cellValue) => {
    currentCell = cell;
    if (cellValue !== cell) {
      setFormulaString(getFormulaStringFromDocument());
      setResultString(getResultStringFromDocument());
    }
    return cell;
  });
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
  const interval = setInterval(() => {
    updateDisplayValues();
  }, 50);
  return () => clearInterval(interval);
}, []);
```

#### Client-Side Update

The updateDisplayValues() function updates the client-side state with the latest data from the spreadSheetClient:

```typescript
const updateDisplayValues = useCallback(async () => {
  const formula = await spreadSheetClient.getFormulaString();
  const result = await spreadSheetClient.getResultString();
  const current = await spreadSheetClient.getCurrentCell();
  const status = await spreadSheetClient.getStatusString();
  setFormulaString(formula);
  setResultString(result);
  setCurrentCell(current);
  setStatusString(status);
}, [spreadSheetClient]);
```

#### Server Communication

The SpreadSheetClient class has a _timedFetch() method that periodically fetches the latest document data from the server:

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

#### Document Update

When new document data is received from the server, the _updateDocument() method in SpreadSheetClient updates the client-side representation of the document:

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

#### Contributing Users

The _updateDocument() method also updates information about contributing users, including which cells they are editing:

```typescript
this._contributingUsers = document.contributingUsers;
```

#### Server-Side Tracking

On the server side, the SpreadSheetController class keeps track of which users are editing which cells:

```typescript
export class SpreadSheetController {
  private _contributingUsers: ContributingUser;

  // ... other properties and methods

  setEditStatus(userName: string, cell: string, editing: boolean): void {
    this._contributingUsers.setEditStatus(userName, cell, editing);
  }

  // ... other methods
}
```

Document Container

The documentContainer() method in SpreadSheetController prepares a container with all the necessary information about the document, including contributing users:

```typescript
documentContainer(userName: string): DocumentTransport {
  return {
    documentName: this._documentName,
    sheetValues: this._sheetMemory.getSheetDisplayStringsForGUI(),
    currentCell: this.getFormulaValue(userName),
    formulaString: this.getFormulaString(userName),
    resultString: this.getResultString(userName),
    contributingUsers: this._contributingUsers.getContributingUsers(),
    error: this._errorOccured,
    statusString: this._statusString,
  };
}
```

This combination of periodic polling, server-side tracking of user edits, and client-side updates allows the client to see other users updating cells in near real-time. The client regularly fetches the latest document state, which includes information about which users are editing which cells, and updates its display accordingly.

##  **User Interface**

Investigate how the app displays different UI components based on user roles:

How does the frontend handle the display of real-time data if applicable (e.g., chat messages, notifications)?

How is the cell ownership displayed to the users.

### Display Real-time Data

#### User Editing Status

The SpreadSheet component uses the currentlyEditing state to determine whether a user is currently editing a cell. This affects the display of certain UI components:

```typescript
const [currentlyEditing, setCurrentlyEditing] = useState(false);

// ... in the JSX
{!currentlyEditing && (
  <button onClick={onButtonClick}>Edit</button>
)}
```

When a user toggles the edit status, the UI is updated to reflect this change.

#### Real-time Cell Updates

The application uses a polling mechanism to fetch updates from the server every 50 milliseconds:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    updateDisplayValues();
  }, 50);
  return () => clearInterval(interval);
}, []);
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
private _contributingUsers: ContributingUser;
```

This information is then passed to the frontend through the documentContainer method, allowing the UI to display which users are editing which cells.

#### Error Messages

The application handles and displays error messages, such as when a user tries to edit a cell that's already being edited by another user:

```typescript
setStatusString(error);
```

These error messages are then displayed to the user through the displayErrorMessage function in the SpreadSheet component:

```typescript
const displayErrorMessage = (message: string) => {
  setStatusString(message);
  // Optionally, you could add more complex error display logic here
};
```

#### Formula and Result Display

The Formula component (rendered in the SpreadSheet component) displays the current formula and its result:

```typescript
<Formula formula={formulaString} result={resultString} />
```

This component is updated in real-time as the user edits the formula or when changes are fetched from the server.

In summary, while the application doesn't have distinct user roles, it does handle different user states (editing vs. viewing) and updates the UI in near real-time to reflect changes made by all users. The frequent polling mechanism ensures that all users see an up-to-date view of the spreadsheet, including which cells are being edited by other users.

### Cell Ownership

The cell ownership is displayed to users through a combination of client-side processing and UI rendering. Here's how it works:

#### Server-side tracking

The SpreadSheetController keeps track of contributing users and their editing status:

```typescript
export class SpreadSheetController {
  private _contributingUsers: ContributingUser;

  // ... other properties and methods

  setEditStatus(userName: string, cell: string, editing: boolean): void {
    this._contributingUsers.setEditStatus(userName, cell, editing);
  }

  // ... other methods
}
```

#### Client-side processing

When the SpreadSheetClient receives updated document data, it processes the contributing users information in the _updateDocument method:

```typescript
private _updateDocument(document: DocumentTransport): void {
  // ... other updates
  this._contributingUsers = document.contributingUsers;
  // ... other updates
}
```

Specifically, it uses the _getEditorString method to determine the editor for each cell:

```typescript
private _getEditorString(cellAddress: string): string {
  const editors = this._contributingUsers.filter(user => user.cell === cellAddress);
  return editors.length > 0 ? editors[0].userName : '';
}
```

#### Preparing display data

The getSheetDisplayStringsForGUI method in SpreadSheetClient prepares the cell data for display, including the editing information:

```typescript
getSheetDisplayStringsForGUI(): string[][] {
  const displayStrings: string[][] = [];
  for (let row = 0; row < this._sheetValues.length; row++) {
    displayStrings[row] = [];
    for (let col = 0; col < this._sheetValues[row].length; col++) {
      const cellValue = this._sheetValues[row][col];
      const cellAddress = `${String.fromCharCode(65 + col)}${row + 1}`;
      const editor = this._# Understanding the Project Structure (Final Part)

[Continuing from where we left off...]

getEditorString(cellAddress);
      displayStrings[row][col] = editor ? `${cellValue}|${editor}` : cellValue;
    }
  }
  return displayStrings;
}
```

This method appends the editor's name to each cell's value, separated by a "|" character.

#### UI Update

The SpreadSheet component in React periodically updates its state with the latest data from SpreadSheetClient:

```typescript
const updateDisplayValues = useCallback(async () => {
  const formula = await spreadSheetClient.getFormulaString();
  const result = await spreadSheetClient.getResultString();
  const current = await spreadSheetClient.getCurrentCell();
  const status = await spreadSheetClient.getStatusString();
  setFormulaString(formula);
  setResultString(result);
  setCurrentCell(current);
  setStatusString(status);
}, [spreadSheetClient]);
```

#### Rendering

While not shown in the provided code snippets, the UI components (likely in a Cell or SheetHolder component) would then render this information. They would split the cell value string on the "|" character and display the editor's name if present.

In summary, cell ownership is tracked on the server, processed and formatted on the client, and then rendered in the UI. The "|" character is used as a delimiter to separate the cell value from the editor's name in the display string.

# Frontend and Backend Interaction

## **API Request-Response Flow** 2

Trace the flow of data from the moment the frontend sends a request to the server to when it receives a response:

- Identify key points in the code where data flows from the server to the client and vice versa.

The data flow process:

Step 1: Frontend Interaction and Request Creation:

The user interacts with the interface, such as clicking to load a document, it triggers a function in LoginPageComponent.tsx that prepares an HTTP request.

```typescript
const getDocument = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  const loadDocumentName = (event.target as HTMLButtonElement).value;
  if (loadDocumentName) {
    resetURL(loadDocumentName);
  }
};
```

Step 2: Sends the HTTP Request

In SpreadSheetClient.ts, the getDocument method sends a request to the server and get the document from the server.

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

Step 3: Server Receives the Request

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

Step 4: Processing the request:

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

Step 5: Sending the Response:

The server sends the response back to the frontend In DocumentServer.ts.

```typescript
res.status(200).send(document);
```

Step 6: Frontend Receives the Response

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

Step 7: Interface Update

In App.tsx, It will update the webpage based on the new document data.

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

- How does the frontend handle errors returned by the server? (didn't find)

In this project, it seems that the project does not have comprehensive error handling for server responses in the frontend. SpreadSheetClient.ts and LoginPageComponent.tsx both lack error handling parts.

## **Real-Time Interaction (if applicable)** 

If the project includes real-time communication, investigate how the client and server communicate in real-time:

How are updates pushed from the server to the client, and how does the UI handle them?

The real-time interaction in this project is primarily achieved through periodic polling from the client to the server. Here's how it works:

### Periodic Polling

The client uses a timed fetch mechanism to periodically request updates from the server. This is implemented in the _timedFetch method of the SpreadSheetClient class:

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

This method sets up a loop that calls getDocument every 100 milliseconds, ensuring that the client frequently checks for updates.

### Document Updates

When the client receives an updated document from the server, it processes the new data in the _updateDocument method:

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

This method updates the client's internal state with the new document data, including information about other users editing cells.

### UI Updates

The SpreadSheet component in React uses a **useEffect** hook to periodically call updateDisplayValues:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    updateDisplayValues();
  }, 50);
  return () => clearInterval(interval);
}, []);
```

The updateDisplayValues function updates various state variables with the latest data from the SpreadSheetClient:

```typescript
const updateDisplayValues = useCallback(async () => {
  const formula = await spreadSheetClient.getFormulaString();
  const result = await spreadSheetClient.getResultString();
  const current = await spreadSheetClient.getCurrentCell();
  const status = await spreadSheetClient.getStatusString();
  setFormulaString(formula);
  setResultString(result);
  setCurrentCell(current);
  setStatusString(status);
}, [spreadSheetClient]);
```

### Handling User Edits

When a user starts editing a cell, the client sends a request to the server using the setEditStatus method:

```typescript
async setEditStatus(userName: string, cell: string, editing: boolean): Promise<EditorResponseType> {
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

This method sends a PUT request to the server to update the editing status of a cell.

### Displaying Other Users' Edits

The getSheetDisplayStringsForGUI method in SpreadSheetClient includes information about which users are editing which cells:

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

This method appends the name of the user editing each cell to the cell's display value, allowing the UI to show which cells are being edited by other users.

In summary, while this system doesn't use real-time technologies like WebSockets, it achieves near-real-time updates through frequent polling. The client regularly fetches the latest document state from the server, updates its internal state, and then triggers UI updates in React. This approach allows users to see changes made by other users with a small delay (up to 100ms in this case).