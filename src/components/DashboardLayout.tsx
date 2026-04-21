'use client';

import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 296;

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Operations Overview',
    subtitle: 'Track account health, onboarding velocity, and what needs attention next.',
  },
  '/dashboard/users': {
    title: 'User Management',
    subtitle: 'Create accounts, search the directory, and keep the team roster in shape.',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const pageDetails = pageMeta[pathname] ?? pageMeta['/dashboard'];
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    [],
  );

  const navItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'User Management', icon: <GroupIcon />, path: '/dashboard/users' },
  ];

const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        px: 2.25,
        py: 2,
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          p: 2.25,
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          color: 'text.primary',
          border: '1px solid rgba(148, 163, 184, 0.16)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              backgroundColor: alpha('#2563eb', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              fontWeight: 900,
            }}
          >
            P
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Primis
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.72 }}>
              Admin Dashboard
            </Typography>
          </Box>
        </Box>

      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 800, ml: 1.25, letterSpacing: '0.14em' }}
        >
          Navigation
        </Typography>
        <List sx={{ p: 0, mt: 1 }}>
          {navItems.map((item) => {
            const isSelected = pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: '14px',
                    px: 1.5,
                    py: 1.15,
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: isSelected ? 'rgba(37, 99, 235, 0.18)' : 'rgba(148, 163, 184, 0.14)',
                    backgroundColor: isSelected ? alpha('#2563eb', 0.08) : 'transparent',
                    color: isSelected ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isSelected ? alpha('#2563eb', 0.1) : alpha('#0f172a', 0.03),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={
                      item.path === '/dashboard'
                        ? 'Metrics and daily signals'
                        : 'Directory and lifecycle actions'
                    }
                    slotProps={{
                      primary: { sx: { fontWeight: 700, fontSize: '0.96rem' } },
                      secondary: {
                        sx: {
                          mt: 0.2,
                          color: 'text.secondary',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '18px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.16)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: alpha('#2563eb', 0.12),
                color: 'primary.main',
                fontWeight: 800,
              }}
            >
              {user?.first_name?.[0] || 'A'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email || 'Administrator'}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1.75 }} />
          <ListItemButton
            onClick={logout}
            sx={{
              px: 1,
              borderRadius: '14px',
              color: 'error.main',
              '&:hover': { bgcolor: alpha('#ef4444', 0.08) },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              secondary="End this admin session"
              slotProps={{
                primary: { sx: { fontWeight: 700 } },
                secondary: { sx: { color: 'inherit', opacity: 0.75 } },
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3.5 }, py: 1.5, alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen((prev) => !prev)}
            sx={{
              mr: 1.5,
              display: { sm: 'none' },
              color: 'text.primary',
              bgcolor: '#ffffff',
              border: '1px solid rgba(148, 163, 184, 0.15)',
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
              {currentDate}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.125 }}>
              {pageDetails.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.35, maxWidth: 660, display: { xs: 'none', md: 'block' } }}
            >
              {pageDetails.subtitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                p: 0.75,
                pr: 1.5,
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 38, height: 38, fontWeight: 800 }}>
                {user?.first_name?.[0] || 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
              <Chip
                label="Live"
                size="small"
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  bgcolor: alpha('#0f172a', 0.06),
                  color: 'text.secondary',
                  fontWeight: 700,
                }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(148, 163, 184, 0.14)',
              backgroundColor: 'transparent',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          position: 'relative',
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          px: { xs: 2, sm: 3.5, md: 4.5 },
          pt: { xs: 11, md: 12 },
          pb: { xs: 3, sm: 4.5 },
        }}
      >
        <Box
          sx={{ position: 'relative' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
