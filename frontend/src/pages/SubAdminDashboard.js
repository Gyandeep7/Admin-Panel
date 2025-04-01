import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SubAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    lastLogin: new Date().toLocaleString(),
    accountStatus: 'Active',
    securityLevel: 'High'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(prevStats => ({
          ...prevStats,
          accountStatus: response.data.user.requestStatus === 'approved' ? 'Active' : 
                        response.data.user.requestStatus === 'pending' ? 'Pending Approval' : 'Rejected'
        }));

        // Mock recent activity data
        setRecentActivity([
          {
            id: 1,
            action: 'Login',
            timestamp: new Date().toLocaleString(),
            status: 'Success'
          },
          {
            id: 2,
            action: 'Profile Update',
            timestamp: new Date(Date.now() - 3600000).toLocaleString(),
            status: 'Success'
          }
        ]);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {user.requestStatus === 'pending' && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          icon={<PendingIcon />}
        >
          Your account is pending approval from the super admin.
        </Alert>
      )}

      {user.requestStatus === 'rejected' && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          icon={<CancelIcon />}
        >
          Your account has been rejected. Please contact the super admin for more information.
        </Alert>
      )}

      {user.requestStatus === 'approved' && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          icon={<CheckCircleIcon />}
        >
          Your account has been approved. You can now access all features.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user.username}!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Here's an overview of your account status and recent activity.
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Account Status</Typography>
                  <Typography variant="h4">{stats.accountStatus}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">Last Login</Typography>
                  <Typography variant="h4">{stats.lastLogin}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">Security Level</Typography>
                  <Typography variant="h4">{stats.securityLevel}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.timestamp}</TableCell>
                      <TableCell>
                        <Typography
                          color={activity.status === 'Success' ? 'success.main' : 'error.main'}
                        >
                          {activity.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubAdminDashboard; 