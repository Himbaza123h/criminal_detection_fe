// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const useAuth = (requiredRole) => {
  const { user, authToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!authToken) {
        navigate('/sign-in');
      } else if (user && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
        navigate('/unauthorized');
      } else if (user) {
        setLoading(false);
      }
    };

    checkAuth();
  }, [authToken, user, requiredRole, navigate]);

  return {
    loading,
    hasRequiredRole: authToken && user && user.role.toLowerCase() === requiredRole.toLowerCase(),
  };
};

export default useAuth;
