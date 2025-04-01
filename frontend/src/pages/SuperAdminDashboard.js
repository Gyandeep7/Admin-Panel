import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Switch,
  Alert,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAdmins: 0,
    systemStatus: 'High',
    pendingRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [subAdminsRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/sub-admins', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/auth/pending-requests', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSubAdmins(subAdminsRes.data);
      setPendingRequests(pendingRes.data);
      setStats({
        totalUsers: subAdminsRes.data.length + 1, // +1 for super admin
        activeAdmins: subAdminsRes.data.filter(admin => admin.isActive).length + 1,
        systemStatus: 'High',
        pendingRequests: pendingRes.data.length
      });
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/sub-admins/${id}/status`,
        { isActive },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Admin status updated successfully');
      fetchDashboardData();
    } catch (error) {
      setError('Failed to update admin status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/admin/sub-admins/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess('Admin deleted successfully');
        fetchDashboardData();
      } catch (error) {
        setError('Failed to delete admin');
      }
    }
  };

  const handleRequestStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/auth/update-request-status/${userId}`,
        { requestStatus: status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess(`Request ${status} successfully`);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update request status');
      console.error('Error updating request status:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, Super Admin {user?.username}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#1976d215',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Total Users
                  </Typography>
                  <Typography variant="h4">{stats.totalUsers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#2e7d3215',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <AdminIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Active Admins
                  </Typography>
                  <Typography variant="h4">{stats.activeAdmins}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#ed6c0215',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    System Status
                  </Typography>
                  <Typography variant="h4">{stats.systemStatus}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#ed6c0215',
                    borderRadius: 1,
                    p: 1,
                    mr: 2
                  }}
                >
                  <PersonIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Pending Requests
                  </Typography>
                  <Typography variant="h4">{stats.pendingRequests}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sub-Admins Management
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subAdmins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Switch
                          checked={admin.isActive}
                          onChange={() => handleStatusChange(admin._id, !admin.isActive)}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(admin._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Pending Sub-Admin Requests</Typography>
            <IconButton onClick={fetchDashboardData}>
              <RefreshIcon />
            </IconButton>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Approve">
                        <IconButton
                          color="success"
                          onClick={() => handleRequestStatus(request._id, 'approved')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          color="error"
                          onClick={() => handleRequestStatus(request._id, 'rejected')}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard; 