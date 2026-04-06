import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { subMonths } from 'date-fns';

import Layout from './components/Layout';
import UserDashboard from './pages/user/UserDashboard';
import Profile from './pages/user/Profile';
import FormationList from './pages/user/FormationList';
import FormationSchedule from './pages/user/FormationSchedule';
import Activities from './pages/user/Activities';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFormations from './pages/admin/AdminFormations';
import AdminUnits from './pages/admin/AdminUnits';
import AdminBreakdown from './pages/admin/AdminBreakdown';

import Landing from './pages/Landing';

// Exported contexts and data shared globally
export const AppContext = createContext();

export const FORMATIONS = [
  { id: 'escapade', title: 'eSCAPade', desc: 'Nature and Aims of SCA' },
  { id: 'pcm-ltw', title: 'PCM-LTW', desc: "Preparatory Cell Meeting-Leaders' Training Workshop-Catechism" },
  { id: 'bow', title: 'Basic Orientation Workshop (BOW)', desc: 'SCA on National and International Level' },
  { id: 'scale', title: 'SCALE', desc: 'Formation not to be talked about but to be experienced' }
];

function App() {
  // Persistent State via LocalStorage Initialization
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sca_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('sca_registeredUsers');
    return saved ? JSON.parse(saved) : [{
       name: "System Administrator",
       chapter: "Headquarters",
       role: "admin",
       username: "admin",
       password: "password123"
    }];
  });
  
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('sca_activities');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep state synced with localStorage
  useEffect(() => {
    localStorage.setItem('sca_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sca_registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('sca_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  const completeActivity = (id) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, status: 'completed' } : a
    ));
  };

  const updateActivityStatus = (id, newStatus) => {
    if (newStatus === 'rejected') {
      cancelActivity(id);
    } else {
      setActivities(activities.map(a =>
        a.id === id ? { ...a, status: newStatus } : a
      ));
    }
  };

  const cancelActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const deleteUser = (username) => {
    const userToDelete = registeredUsers.find(u => u.username === username);
    setRegisteredUsers(registeredUsers.filter(u => u.username !== username));
    
    if (userToDelete) {
      setActivities(activities.filter(a => {
        if (a.username) return a.username !== username;
        if (a.schoolName && userToDelete.school) return a.schoolName !== userToDelete.school;
        return a.userName !== userToDelete.name;
      }));
    } else {
      setActivities(activities.filter(a => a.username !== username));
    }
  };

  const isEligible = (formationId) => {
    const isCompleted = (id) => activities.some(a => a.username === currentUser?.username && a.formationId === id && a.status === 'completed');
    if (formationId === 'escapade') return true;
    if (formationId === 'pcm-ltw') return isCompleted('escapade');
    if (formationId === 'bow') return isCompleted('escapade') && isCompleted('pcm-ltw');
    if (formationId === 'scale') return isCompleted('escapade') && isCompleted('pcm-ltw') && isCompleted('bow');
    return true; // Default fallback for unknown formations
  };

  const approveUser = (username) => {
    setRegisteredUsers(registeredUsers.map(u => 
      u.username === username ? { ...u, status: 'approved' } : u
    ));
  };

  const rejectUser = (username) => {
    setRegisteredUsers(registeredUsers.filter(u => u.username !== username));
  };

  const registerUser = (userData) => {
    const newUser = { ...userData, status: 'pending' };
    setRegisteredUsers([...registeredUsers, newUser]);
    return newUser; // Do not auto-login
  };

  const attemptLogin = (username, password) => {
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    if (user) {
      if (user.status === 'pending') {
        return { success: false, message: "Your account is still waiting for Administrator approval. Please wait." };
      }
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: "Invalid username or password, or account does not exist." };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Sanitize trailing orphaned activities from older system iterations
  const validActivities = activities.filter(a => 
    registeredUsers.some(u => 
        (a.username && a.username === u.username) || 
        (!a.username && a.schoolName === u.school)
    )
  );

  return (
    <AppContext.Provider value={{ 
        currentUser, registerUser, attemptLogin, registeredUsers, deleteUser,
        approveUser, rejectUser,
        logout, activities: validActivities, addActivity, completeActivity, cancelActivity, 
        updateActivityStatus, isEligible 
    }}>
      <BrowserRouter>
        {currentUser ? (
          <Layout>
            <Routes>
              {currentUser.role === 'admin' ? (
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/formations" element={<AdminFormations />} />
                  <Route path="/admin/units" element={<AdminUnits />} />
                  <Route path="/admin/breakdown" element={<AdminBreakdown />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </>
              ) : (
                <>
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  <Route path="/user/profile" element={<Profile />} />
                  <Route path="/user/formation" element={<FormationList />} />
                  <Route path="/user/formation/:id" element={<FormationSchedule />} />
                  <Route path="/user/activities" element={<Activities />} />
                  <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                </>
              )}
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
