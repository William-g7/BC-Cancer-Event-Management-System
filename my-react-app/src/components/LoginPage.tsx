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
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError('Both fields are required.');
    } else {
      // Implement login logic here
      console.log('Logged in with:', { email, password });
      navigate('/dashboard'); // Redirect to the event page
    }
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
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            onClick={handleLogin}
            sx={{
              mt: 2,
              backgroundColor: 'primary.main',
              ':hover': { backgroundColor: 'primary.dark' }, // Darken on hover
            }}
          >
            Log in
          </Button>
        </Sheet>
      </main>
    </div>
  );
};

export default LoginPage;
