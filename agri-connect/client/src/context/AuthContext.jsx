import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getMe();
        setUser(data.user);
        // Clear any stale local demo session if real backend auth succeeds
        localStorage.removeItem('agriconnect_demo_user');
      } catch {
        // If backend session not found, check if a local demo session exists
        const savedDemo = localStorage.getItem('agriconnect_demo_user');
        if (savedDemo) {
          try {
            setUser(JSON.parse(savedDemo));
          } catch {
            localStorage.removeItem('agriconnect_demo_user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      setUser(data.user);
      localStorage.removeItem('agriconnect_demo_user');
      return data.user;
    } catch (err) {
      // Check if this was a known demo account
      const savedDemo = localStorage.getItem('agriconnect_demo_user');
      if (savedDemo) {
        const parsed = JSON.parse(savedDemo);
        if (parsed.email === email) {
          setUser(parsed);
          return parsed;
        }
      }
      throw err;
    }
  };

  const loginAsDemo = async (demoProfile) => {
    // 1. Immediately establish session for instant feedback
    setUser(demoProfile);
    localStorage.setItem('agriconnect_demo_user', JSON.stringify(demoProfile));

    // 2. Best-effort background sync with backend DB (if server is up)
    try {
      const { data } = await loginUser({
        email: demoProfile.email,
        password: demoProfile.password,
      });
      if (data?.user) {
        setUser(data.user);
      }
    } catch {
      // If login failed because user is not registered in MongoDB yet, try registering
      try {
        const { data } = await registerUser({
          username: demoProfile.username,
          email: demoProfile.email,
          password: demoProfile.password,
          serviceProvider: demoProfile.serviceProvider || 'No',
          language: demoProfile.language || 'en',
        });
        if (data?.user) {
          setUser(data.user);
        }
      } catch {
        // Server might be offline or sleeping; local demo session remains active
      }
    }

    return demoProfile;
  };

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    setUser(data.user);
    localStorage.removeItem('agriconnect_demo_user');
    return data.user;
  };

  const logout = async () => {
    localStorage.removeItem('agriconnect_demo_user');
    try {
      await logoutUser();
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
