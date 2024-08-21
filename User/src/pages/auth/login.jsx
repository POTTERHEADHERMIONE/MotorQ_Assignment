import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Checkbox, FormControlLabel, Button, Card, CardContent, Alert, CircularProgress, Box } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:5000/users');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = await response.json();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');
                setMessage({ isError: false, content: 'Login successful!' });
                navigate(user.role === 'admin' ? '/admin' : '/user-home');
            } else {
                setMessage({ isError: true, content: 'Invalid email or password!' });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage({ isError: true, content: 'An error occurred. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', px: 2 }}>
            <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    {message && (
                        <Alert severity={message.isError ? 'error' : 'success'} sx={{ mb: 2 }}>
                            {message.content}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{ mt: 3 }}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ py: 1.5, mt: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                No account yet?{' '}
                                <Button color="primary" onClick={() => navigate('/sign-up')}>
                                    Sign Up
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;
