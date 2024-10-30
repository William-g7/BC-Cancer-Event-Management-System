# Header Component Username Implementation

all requests to the backend will have the username in the header(response header not the frontend component)

1. The API utility class sets the username in headers:

```typescript
private username: string = localStorage.getItem('username') || '';
```

2. The auth service stores the username in the localStorage after login:

```typescript
localStorage.setItem('username', username);
```

3. The backend middleware checks for this header:

```typescript
const username = req.headers['x-user-name'] as string;
```

This ensures that the username is available in the backend middleware for authentication and authorization checks.

main changes in frontend:
1. src/services/auth.ts
2. src/components/Header.tsx
3. src/utils/api.ts
(api.ts in utils is a method to make all the api requests (response and request))
4. I also add the username to the frontend header component for display

main changes in backend:
1. src/controllers/auth.controller.ts
2. src/middleware/auth.ts
3. src/types/account.types.ts
4. src/types/custom-request.ts


possible works to do:
1. read the username from the response body of the login API
2. change the login page to use the new API

