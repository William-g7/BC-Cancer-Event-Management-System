import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { useState } from 'react';
import useLogin from '../hooks/useLogin.ts'; // Import the useLogin hook
import './LoginPage.css';

const LoginPage: React.FC = () => {

  const { handleLogin, loading, error } = useLogin(); // Use the useLogin hook
  const [username, setUsername] = useState(''); // Updated to use state
  const [password, setPassword] = useState(''); // Updated to use state
  
  const onLogin = () => {
    handleLogin(username, password); // Call the handleLogin function
  };


  return (
    <div style= {{position: 'absolute', right: 40}}>
      <div style={{ textAlign: 'left', lineHeight: 1, marginTop: '5rem', marginLeft: '6rem' }}> {/* Center the div horizontally */}
      <h1 className="no-space">BC</h1>
      <h1 className="no-space">CANCER</h1>
      </div>
      <CssBaseline />
      <Sheet
        sx={{
        width: { xs: '17.5rem', sm: '18.75rem' }, // Responsive width in rem
        mx: 'auto', // margin left & right
        my: '1.5rem', // margin top & bottom
        py: '0.75rem', // padding top & bottom
        px: '0.5rem', // padding left & right
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        borderRadius: '0.25rem',
        boxShadow: '0.25rem',
        bgcolor: 'transparent', // Adjust background for theming
        }}
      >
        <div>
        <Typography level="h3" component="h1" textAlign="center">
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
        <Typography color="danger" sx={{ fontSize: '0.875rem', mt: '0.25rem' }}>
          {error}
        </Typography>
        )}
        
        <Button
        onClick={onLogin} // Call the new onLogin function
        disabled={loading} // Disable button while loading
        sx={{
          mt: '0.5rem',
          backgroundColor: 'black',
          ':hover': { backgroundColor: 'black' },
        }}
        >
        Log in {/* Show loading text */}
        </Button>
      </Sheet>
      </div>   
  );
};

export default LoginPage;
