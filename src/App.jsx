import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

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

export const AppContext = createContext();

export const FORMATIONS = [
  { id: 'escapade', title: 'eSCAPade', desc: 'Nature and Aims of SCA' },
  { id: 'pcm-ltw', title: 'PCM-LTW', desc: "Preparatory Cell Meeting-Leaders' Training Workshop-Catechism" },
  { id: 'bow', title: 'Basic Orientation Workshop (BOW)', desc: 'SCA on National and International Level' },
  { id: 'scale', title: 'SCALE', desc: 'Formation not to be talked about but to be experienced' }
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase Auth & Data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error("Session error:", error);
        
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error in fetchSession:", err);
        setLoading(false);
      }
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch all users and activities when an admin logs in, or just activities for a regular user
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        fetchAllProfiles();
        fetchAllActivities();
      } else {
        fetchUserActivities(currentUser.username);
      }
    }
  }, [currentUser]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setRegisteredUsers(data);
  };

  const fetchAllActivities = async () => {
    const { data } = await supabase.from('activities').select('*');
    if (data) setActivities(data);
  };

  const fetchUserActivities = async (username) => {
    const { data } = await supabase.from('activities').select('*').eq('username', username);
    if (data) setActivities(data);
  };

  const addActivity = async (activity) => {
    const { data, error } = await supabase.from('activities').insert([activity]).select();
    if (data) {
      setActivities([...activities, data[0]]);
    }
  };

  const completeActivity = async (id) => {
    const { data } = await supabase.from('activities').update({ status: 'completed' }).eq('id', id).select();
    if (data) {
      setActivities(activities.map(a => a.id === id ? data[0] : a));
    }
  };

  const updateActivityStatus = async (id, newStatus) => {
    if (newStatus === 'rejected') {
      await cancelActivity(id);
    } else {
      const { data } = await supabase.from('activities').update({ status: newStatus }).eq('id', id).select();
      if (data) {
        setActivities(activities.map(a => a.id === id ? data[0] : a));
      }
    }
  };

  const cancelActivity = async (id) => {
    await supabase.from('activities').delete().eq('id', id);
    setActivities(activities.filter(a => a.id !== id));
  };

  const deleteUser = async (username) => {
    const userToDelete = registeredUsers.find(u => u.username === username);
    if (!userToDelete) return;
    
    // Deleting from auth.users (requires service role, so typically users just get disabled, but here we can delete profile via SQL or just delete from profiles if RLS allows it; wait, delete from profiles)
    await supabase.from('profiles').delete().eq('id', userToDelete.id);
    setRegisteredUsers(registeredUsers.filter(u => u.username !== username));
    
    fetchActivitiesAfterUserDelete(username, userToDelete);
  };

  const fetchActivitiesAfterUserDelete = async (username, userToDelete) => {
    // Cascade delete on activities should do this, but just update state locally
    if (userToDelete) {
      setActivities(activities.filter(a => {
        if (a.username) return a.username !== username;
        if (a.schoolName && userToDelete.school) return a.schoolName !== userToDelete.school;
        return a.userName !== userToDelete.full_name;
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
    return true; 
  };

  const approveUser = async (username) => {
    const { data } = await supabase.from('profiles').update({ status: 'approved' }).eq('username', username).select();
    if (data) {
      setRegisteredUsers(registeredUsers.map(u => u.username === username ? data[0] : u));
    }
  };

  const rejectUser = async (username) => {
    // Delete their profile
    const user = registeredUsers.find(u => u.username === username);
    if (user) {
       await supabase.from('profiles').delete().eq('id', user.id);
       setRegisteredUsers(registeredUsers.filter(u => u.username !== username));
    }
  };

  // Deprecated since Landing uses Supabase directly now, but keeping dummy for compatibility until Landing.jsx is updated
  const registerUser = () => {}; 
  const attemptLogin = () => {}; 

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#1e293b'}}>Loading SCA Scheduling System...</div>;
  }

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
        logout, activities: currentUser && currentUser.role === 'admin' ? validActivities : activities, addActivity, completeActivity, cancelActivity, 
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
