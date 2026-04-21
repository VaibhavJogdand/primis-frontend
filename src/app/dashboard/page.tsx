'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Fade,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usersService } from '@/services/users.service';
import { User } from '@/types/user.types';

export default function DashboardHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await usersService.getAll();
        setUsers(response);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const getInitials = (first_name?: string, last_name?: string) =>
    `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 'U';

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const initials = new Set(
      users.map((entry) => `${entry.first_name?.[0] || ''}${entry.last_name?.[0] || ''}`),
    ).size;
    const companyRatio = totalUsers
      ? Math.round(
          (users.filter((entry) => (entry.email || '').endsWith('@company.com')).length / totalUsers) *
            100,
        )
      : 0;

    return [
      {
        label: 'Directory Size',
        value: totalUsers.toString().padStart(2, '0'),
        description: 'Accounts currently visible to admins',
        icon: <GroupOutlinedIcon fontSize="large" />,
        accent: '#2563eb',
      },
      {
        label: 'Identity Spread',
        value: initials.toString().padStart(2, '0'),
        description: 'Unique initial pairs across the roster',
        icon: <InsightsOutlinedIcon fontSize="large" />,
        accent: '#059669',
      },
      {
        label: 'Company Domain',
        value: `${companyRatio}%`,
        description: 'Users on the primary corporate email domain',
        icon: <ManageAccountsOutlinedIcon fontSize="large" />,
        accent: '#ea580c',
      },
    ];
  }, [users]);

  const recentUsers = [...users].slice(0, 5);

  return (
    <Fade in timeout={450}>
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: '24px',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            backgroundColor: 'background.paper',
          }}
        >
          <Chip
            label="Overview"
            sx={{
              mb: 2,
              bgcolor: alpha('#2563eb', 0.08),
              color: 'primary.main',
              fontWeight: 700,
            }}
          />
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, maxWidth: 720, lineHeight: 1.2, fontSize: { xs: '1.75rem', md: '2rem' } }}
          >
            Welcome back, {user?.first_name || 'Admin'}.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 640 }}>
            Review the latest roster, create users quickly, and keep onboarding operations moving without leaving the dashboard.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard/users')}
              endIcon={<ArrowOutwardIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Open User Management
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/dashboard/users')}
              sx={{
                alignSelf: 'flex-start',
                borderColor: 'divider',
                color: 'text.primary',
              }}
            >
              View Directory
            </Button>
          </Stack>
        </Paper>

        {error && <Alert severity="error" sx={{ mt: 3, borderRadius: '18px' }}>{error}</Alert>}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {stats.map((stat, index) => (
              <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: '20px',
                    border: '1px solid rgba(148, 163, 184, 0.16)',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: '18px',
                        bgcolor: alpha(stat.accent, 0.12),
                        color: stat.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Chip
                      label="Live"
                      size="small"
                      sx={{ bgcolor: alpha('#0f172a', 0.05), fontWeight: 700 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontWeight: 700 }}>
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ mt: 0.75, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2rem' } }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {stat.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '1px solid rgba(148, 163, 184, 0.16)',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Recent Directory Entries
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      A quick snapshot of the current users list.
                    </Typography>
                  </Box>
                  <Button variant="text" onClick={() => router.push('/dashboard/users')}>
                    View all
                  </Button>
                </Box>

                <Stack spacing={1.5}>
                  {recentUsers.length ? (
                    recentUsers.map((entry) => (
                      <Box
                        key={entry.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 2,
                          p: 1.75,
                          borderRadius: '14px',
                          bgcolor: alpha('#0f172a', 0.02),
                          border: '1px solid rgba(148, 163, 184, 0.12)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                          <Avatar sx={{ bgcolor: alpha('#2563eb', 0.12), color: 'primary.main', fontWeight: 800 }}>
                            {getInitials(entry.first_name, entry.last_name)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                              {`${entry.first_name || ''} ${entry.last_name || ''}`.trim() || 'Unnamed User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {entry.email || 'No email available'}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip label={`#${entry.id}`} size="small" sx={{ fontWeight: 700 }} />
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        borderRadius: '20px',
                        textAlign: 'center',
                        bgcolor: alpha('#f8fafc', 0.9),
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        No users yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Start by creating the first account from the user management page.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>

            
          </Grid>
        )}
      </Box>
    </Fade>
  );
}

function DashboardSkeleton() {
  return (
    <Grid container spacing={3} sx={{ mt: 0.5 }}>
      {[1, 2, 3].map((item) => (
        <Grid key={item} size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Skeleton variant="rounded" width={54} height={54} />
              <Skeleton variant="rounded" width={56} height={24} />
            </Box>
            <Skeleton width="40%" height={24} sx={{ mt: 2.5 }} />
            <Skeleton width="32%" height={52} />
            <Skeleton width="80%" height={22} />
          </Paper>
        </Grid>
      ))}

      <Grid size={{ xs: 12, lg: 7 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ width: '60%' }}>
              <Skeleton width="45%" height={32} />
              <Skeleton width="70%" height={22} />
            </Box>
            <Skeleton variant="rounded" width={72} height={32} />
          </Box>

          <Stack spacing={1.5}>
            {[1, 2, 3, 4].map((item) => (
              <Box
                key={item}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  p: 1.75,
                  borderRadius: '14px',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flexGrow: 1 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton width="35%" height={24} />
                    <Skeleton width="55%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="rounded" width={44} height={24} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            backgroundColor: 'background.paper',
            height: '100%',
          }}
        >
          <Skeleton width="30%" height={32} />
          <Skeleton width="90%" height={22} sx={{ mt: 1 }} />
          <Skeleton width="72%" height={22} />

          <Stack spacing={1.5} sx={{ mt: 3 }}>
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{
                  p: 1.5,
                  borderRadius: '16px',
                  bgcolor: 'white',
                  border: '1px solid rgba(148, 163, 184, 0.14)',
                }}
              >
                <Skeleton width="100%" height={22} />
                <Skeleton width="85%" height={22} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
