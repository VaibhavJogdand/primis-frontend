'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function RegisterPage() {
  const { login } = useAuth();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email,
        password,
      });

      const response = await authService.login({ email, password });
      const token = response.access_token || response.token;

      localStorage.setItem('token', token);
      const userData = await authService.getMe();

      login(token, userData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            gap: { xs: 3, md: 4 },
            alignItems: 'stretch',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5, md: 6 },
              borderRadius: '28px',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { md: 680 },
            }}
          >
            <Box>
              <Box sx={{ mb: 3 }}>
                <BrandLogo size={52} />
              </Box>

              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                Primis Onboarding
              </Typography>
              <Typography
                variant="h3"
                sx={{ mt: 1, fontWeight: 800, maxWidth: 430, fontSize: { xs: '2rem', md: '2.375rem' } }}
              >
                Create your admin account
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 520 }}>
                Set up your account to access the dashboard, manage users, and work inside the same clean admin environment.
              </Typography>
            </Box>

            
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5 },
              borderRadius: '28px',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
              Enter your details to get started.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="given-name"
                  autoFocus
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Box>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={<ArrowOutwardIcon />}
                sx={{ mt: 3, py: 1.5, borderRadius: '14px' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  Sign in
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
