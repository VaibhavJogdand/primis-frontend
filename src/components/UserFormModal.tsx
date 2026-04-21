'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { User, UserPayload } from '../types/user.types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: UserPayload) => void;
  user?: User | null;
}

export default function UserFormModal({
  open,
  onClose,
  onSubmit,
  user,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserPayload>({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
      });
    }
    setErrors({});
  }, [open, user]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) nextErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) nextErrors.last_name = 'Last name is required';
    if (!formData.email?.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isEditMode = Boolean(user);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
          },
        },
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (validate()) onSubmit(formData);
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            pt: 3,
            pb: 2,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '14px',
                  bgcolor: alpha('#2563eb', 0.08),
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonOutlineIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {isEditMode ? 'Edit User' : 'Create User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                  {isEditMode
                    ? 'Update the existing account details below.'
                    : 'Add a new user to the internal directory. Passwords are handled only through registration.'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ alignSelf: 'flex-start' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
                slotProps={{ input: { sx: { borderRadius: '14px' } } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
                slotProps={{ input: { sx: { borderRadius: '14px' } } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email || ''}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                slotProps={{ input: { sx: { borderRadius: '14px' } } }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button onClick={onClose} variant="text" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ px: 3.5, borderRadius: '14px' }}>
            {isEditMode ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
