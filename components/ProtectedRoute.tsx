/* eslint-disable react/react-in-jsx-scope */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../services/auth';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated and not in loading state, redirect to login
    if (!loading && !user) {
      // Save the current path to redirect back after login
      const currentPath = router.asPath;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [loading, user, router]);

  // If loading, show a loading spinner
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, don't show the protected content
  if (!user) {
    return null;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
