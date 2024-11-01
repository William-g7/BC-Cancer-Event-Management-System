import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useState } from 'react';
import useLogin from '../hooks/useLogin.ts'; // Import the useLogin hook

const LoginPage: React.FC = () => {

  const { handleLogin, loading, error } = useLogin(); // Use the useLogin hook
  const [username, setUsername] = useState(''); // Updated to use state
  const [password, setPassword] = useState(''); // Updated to use state
  
  const onLogin = () => {
    handleLogin(username, password); // Call the handleLogin function
  };


  return (
    <div>
      <Typography component="h1" textAlign="center">
        BC CANCER
      </Typography>
      <main>
        <CssBaseline />
        <Sheet
          sx={{
            width: { xs: 280, sm: 300 }, // Responsive width
            mx: 'auto', // margin left & right
            my: 4, // margin top & bottom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
            bgcolor: 'transparent', // Adjust background for theming
          }}
          variant="outlined"
        >
          <div>
            <Typography level="h4" component="h1" textAlign="center">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body-sm" textAlign="center">
              Sign in to continue.
            </Typography>
          </div>
          <FormControl>
            <FormLabel>Username</FormLabel> {/* Changed to Username */}
            <Input
              name="username" // Updated name
              type="text" // Changed type to text
              placeholder="johndoe"
              value={username} // Updated to use username
              onChange={(e) => setUsername(e.target.value)} // Updated to set username
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          
          {error && (
            <Typography color="danger" sx={{ fontSize: 'sm', mt: 1 }}>
              {error}
            </Typography>
          )}
          
          <Button
            onClick={onLogin} // Call the new onLogin function
            disabled={loading} // Disable button while loading
            sx={{
              mt: 2,
              backgroundColor: 'primary.main',
              ':hover': { backgroundColor: 'primary.dark' },
            }}
          >
            {loading ? 'Logging in...' : 'Log in'} {/* Show loading text */}
          </Button>
        </Sheet>
      </main>
    </div>
  );
};

export default LoginPage;
