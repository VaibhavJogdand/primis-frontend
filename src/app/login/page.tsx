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

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const token = response.access_token || response.token;

      localStorage.setItem('token', token);
      const userData = await authService.getMe();

      login(token, userData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
      localStorage.removeItem('token');
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
              minHeight: { md: 640 },
            }}
          >
            <Box>
              <Box sx={{ mb: 3 }}>
                <BrandLogo size={52} />
              </Box>

              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                Primis Access
              </Typography>
              <Typography
                variant="h3"
                sx={{ mt: 1, fontWeight: 800, maxWidth: 420, fontSize: { xs: '2rem', md: '2.375rem' } }}
              >
                Sign in to your admin workspace
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 500 }}>
                Access the dashboard, manage the team directory, and continue your daily admin work from one place.
              </Typography>
            </Box>

            <Box sx={{ mt: { xs: 4, md: 8 } }}>
              {[
                'Minimal admin interface aligned with the dashboard experience.',
                'Secure login flow with profile-based access after authentication.',
                'Direct handoff into user operations and overview screens.',
              ].map((item) => (
                <Box
                  key={item}
                  sx={{
                    py: 1.5,
                    borderTop: '1px solid rgba(148, 163, 184, 0.14)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              ))}
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
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
              Enter your credentials to continue.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
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
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                New to Primis?
              </Typography>
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  Create account
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
