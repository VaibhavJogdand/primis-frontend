'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Fade,
  Grid,
  InputBase,
  Paper,
  Skeleton,
  Typography,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import UserTable from '@/components/UserTable';
import UserFormModal from '@/components/UserFormModal';
import { User, UserPayload } from '@/types/user.types';
import { usersService } from '@/services/users.service';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      try {
        await usersService.softDelete(user.id);
        await fetchUsers();
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleSubmitUser = async (userData: UserPayload) => {
    try {
      if (editingUser) {
        await usersService.update(editingUser.id, userData);
      } else {
        await usersService.create(userData);
      }
      handleCloseModal();
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, users],
  );

  const summary = [
    {
      label: 'Total Users',
      value: users.length,
      icon: <Groups2OutlinedIcon fontSize="large" />,
      accent: '#2563eb',
      note: 'Visible in the directory',
    },
    {
      label: 'Filtered Results',
      value: filteredUsers.length,
      icon: <TravelExploreOutlinedIcon fontSize="large" />,
      accent: '#0f766e',
      note: searchQuery ? 'Matching the current search' : 'Showing the full roster',
    },
    {
      label: 'Unique Domains',
      value: new Set(users.map((user) => user.email.split('@')[1] || 'unknown')).size,
      icon: <BadgeOutlinedIcon fontSize="large" />,
      accent: '#ea580c',
      note: 'Email domains in active use',
    },
  ];

  return (
    <Fade in timeout={450}>
      <Box>
        <Box sx={{ mb: 3.5 }}>
          <Breadcrumbs sx={{ mb: 1.25, '& .MuiBreadcrumbs-li': { fontSize: '0.875rem' } }}>
            <Typography color="text.secondary">Dashboard</Typography>
            <Typography color="text.primary" sx={{ fontWeight: 700 }}>
              User Management
            </Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.25 },
              borderRadius: '24px',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 2.5,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', lg: 'center' },
              }}
            >
              <Box>
                <Chip
                  label="Directory Admin"
                  sx={{
                    mb: 1.5,
                    bgcolor: alpha('#2563eb', 0.08),
                    color: '#1d4ed8',
                    fontWeight: 700,
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2rem' } }}>
                  Manage users
                </Typography>
          
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: '12px',
                }}
              >
                Create User
              </Button>
            </Box>
          </Paper>
        </Box>

        

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: '18px',
            backgroundColor: 'background.paper',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            display: 'flex',
            alignItems: { xs: 'stretch', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderRadius: '14px',
              backgroundColor: alpha('#0f172a', 0.02),
              border: '1px solid rgba(148, 163, 184, 0.16)',
              flexGrow: 1,
              '&:focus-within': {
                boxShadow: `0 0 0 4px ${alpha('#2563eb', 0.12)}`,
                borderColor: 'rgba(37, 99, 235, 0.3)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1.25 }} />
            <InputBase
              placeholder="Search by name or email"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ fontSize: '0.95rem' }}
            />
          </Box>
          <Chip
            label={searchQuery ? `${filteredUsers.length} matches` : `${users.length} users loaded`}
            sx={{
              alignSelf: { xs: 'flex-start', md: 'center' },
              bgcolor: alpha('#0f172a', 0.06),
              fontWeight: 700,
            }}
          />
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <UsersTableSkeleton />
        ) : (
          <UserTable users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        )}

        <UserFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitUser}
          user={editingUser}
        />
      </Box>
    </Fade>
  );
}

function UsersTableSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid rgba(148, 163, 184, 0.16)',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2.25,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1.5,
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        }}
      >
        <Box sx={{ width: '50%' }}>
          <Skeleton width="35%" height={30} />
          <Skeleton width="65%" height={22} />
        </Box>
        <Skeleton variant="rounded" width={96} height={28} />
      </Box>

      <Box sx={{ p: 3 }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Box
            key={item}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 2fr) minmax(180px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) auto',
              alignItems: 'center',
              gap: 2,
              py: 2,
              borderBottom: item === 5 ? 'none' : '1px solid rgba(148, 163, 184, 0.12)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="circular" width={46} height={46} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton width="50%" height={24} />
                <Skeleton width="36%" height={20} />
              </Box>
            </Box>
            <Skeleton width="80%" height={22} />
            <Skeleton variant="rounded" width={90} height={26} />
            <Skeleton variant="rounded" width={64} height={26} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
