import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { Users, School, Trash2, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, registeredUsers, deleteUser, logout } = useContext(AppContext);

  const uniqueSchools = [...new Set(registeredUsers.filter(u => u.school).map(u => u.school))];

  const handleDeleteUser = (username) => {
    if (window.confirm(`Are you absolutely sure you want to delete the user account "${username}"? They will lose all access.`)) {
      deleteUser(username);
    }
  };

  return (
    <div className="animation-fade-in" style={{ padding: '0 1rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ color: 'var(--pk-blue-800)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--pk-text-muted)', fontSize: '1.1rem' }}>Overall System Management & User Oversight</p>
        </div>
        <button 
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <LogOut size={18} /> Admin Log Out
        </button>
      </header>

      {/* Analytics KIPs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
         <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid var(--pk-border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--pk-blue-50)', color: 'var(--pk-blue-600)', borderRadius: '8px' }}>
                    <Users size={24} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--pk-text-main)' }}>Total Registered</h3>
             </div>
             <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--pk-blue-800)', margin: 0 }}>{registeredUsers.length}</p>
         </div>

         <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid var(--pk-border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--pk-blue-50)', color: 'var(--pk-blue-600)', borderRadius: '8px' }}>
                    <School size={24} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--pk-text-main)' }}>Unique Units</h3>
             </div>
             <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--pk-blue-800)', margin: 0 }}>{uniqueSchools.length}</p>
         </div>
      </div>

      {/* Directory Management */}
      <section>
        <h2 style={{ color: 'var(--pk-blue-800)', marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.75rem' }}>System Directory Management</h2>
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--pk-border)' }}>
           <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ backgroundColor: 'var(--pk-gray-50)', borderBottom: '1px solid var(--pk-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--pk-text-muted)', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: '1rem', color: 'var(--pk-text-muted)', fontWeight: 600 }}>Chapter</th>
                    <th style={{ padding: '1rem', color: 'var(--pk-text-muted)', fontWeight: 600 }}>Role</th>
                    <th style={{ padding: '1rem', color: 'var(--pk-text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {registeredUsers.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--pk-border)' }}>
                        <td style={{ padding: '1rem', color: 'var(--pk-text-main)', fontWeight: 500 }}>{user.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--pk-text-muted)' }}>{user.chapter || 'SCA Admin Team'}</td>
                        <td style={{ padding: '1rem' }}>
                           <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: user.role === 'admin' ? '#f3e8ff' : '#f0f9ff', color: user.role === 'admin' ? '#7e22ce' : '#0369a1' }}>
                             {user.role}
                           </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                            {user.username !== currentUser.username && (
                                <button 
                                    onClick={() => handleDeleteUser(user.username)}
                                    style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', padding: '0.25rem', display: 'inline-flex', alignItems: 'center', opacity: 0.7 }}
                                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                                    onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                                    title="Delete User Account"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </td>
                    </tr>
                 ))}
                 {registeredUsers.length === 0 && (
                    <tr>
                       <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--pk-text-muted)' }}>No users registered yet.</td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
}
