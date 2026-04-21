'use client';

import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import { User } from '../types/user.types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedUsers = useMemo(
    () => users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, users],
  );

  const getInitials = (first_name: string, last_name: string) =>
    `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase();

  return (
    <TableContainer
      component={Paper}
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
          backgroundColor: '#ffffff',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Team Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review account details, update user information, or remove access.
          </Typography>
        </Box>
        <Chip label={`${users.length} records`} sx={{ fontWeight: 700 }} />
      </Box>

      <Table sx={{ minWidth: 760 }} aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 3 }}>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" sx={{ pr: 3 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: alpha('#0f172a', 0.025) },
              }}
            >
              <TableCell sx={{ pl: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                  <Avatar
                    sx={{
                      width: 46,
                      height: 46,
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      bgcolor: alpha('#2563eb', 0.1),
                      color: 'primary.main',
                    }}
                  >
                    {getInitials(user.first_name, user.last_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {user.first_name} {user.last_name}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
                  <AlternateEmailOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: alpha('#16a34a', 0.12),
                    color: '#15803d',
                  }}
                />
              </TableCell>

              <TableCell align="right" sx={{ pr: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Edit user">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(user)}
                      sx={{
                        color: '#1d4ed8',
                        bgcolor: alpha('#2563eb', 0.08),
                        '&:hover': { bgcolor: alpha('#2563eb', 0.12) },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {onDelete && (
                    <Tooltip title="Delete user">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(user)}
                        sx={{
                          color: '#dc2626',
                          bgcolor: alpha('#ef4444', 0.08),
                          '&:hover': { bgcolor: alpha('#ef4444', 0.12) },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 9 }}>
                <Box sx={{ maxWidth: 360, mx: 'auto' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    No users match the current view
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Clear the search or create a new account to populate the directory.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}
      />
    </TableContainer>
  );
}
