import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStudentProfile } from '../services/apiClient';
import { useAuth } from './AuthContext';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const data = await fetchStudentProfile();
        setStudent(data);
      } else if (user) {
        setStudent(user);
      } else {
        setStudent(null);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load student profile context:', err);
      if (user) {
        setStudent(user);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user, isAuthenticated]);

  return (
    <StudentContext.Provider value={{ student, setStudent, loading, refreshStudent: loadProfile }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentProfile() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudentProfile must be used within StudentProvider');
  return ctx;
}

// Backward compatibility alias
export const DemoStudentProvider = StudentProvider;
export const useDemoStudent = useStudentProfile;

