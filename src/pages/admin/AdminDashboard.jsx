import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { Users, School, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, registeredUsers, deleteUser } = useContext(AppContext);

  const uniqueSchools = [...new Set(registeredUsers.filter(u => u.school).map(u => u.school))];

  const handleDeleteUser = (username) => {
    if (window.confirm(`Are you absolutely sure you want to delete the user account "${username}"? They will lose all access.`)) {
      deleteUser(username);
    }
  };

  return (
    <div className="animation-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ color: 'var(--pk-blue-800)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--pk-text-muted)', fontSize: '1.1rem' }}>Overall System Management & User Oversight</p>
      </header>

      {/* Analytics KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
         <div style={{ backgroundColor: 'white', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--pk-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', transition: 'transform 0.2s ease', cursor: 'default' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} 
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
             <div>
                <h3 style={{ margin: 0, color: 'var(--pk-text-muted)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registered</h3>
                <p style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--pk-text-main)', margin: '0.5rem 0 0' }}>{registeredUsers.length}</p>
             </div>
             <div style={{ padding: '1rem', backgroundColor: 'var(--pk-blue-50)', color: 'var(--pk-blue-600)', borderRadius: '12px' }}>
                 <Users size={28} />
             </div>
         </div>

         <div style={{ backgroundColor: 'white', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--pk-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', transition: 'transform 0.2s ease', cursor: 'default' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} 
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
             <div>
                <h3 style={{ margin: 0, color: 'var(--pk-text-muted)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unique Units</h3>
                <p style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--pk-text-main)', margin: '0.5rem 0 0' }}>{uniqueSchools.length}</p>
             </div>
             <div style={{ padding: '1rem', backgroundColor: 'var(--pk-blue-50)', color: 'var(--pk-blue-600)', borderRadius: '12px' }}>
                 <School size={28} />
             </div>
         </div>
      </div>

      {/* Directory Management */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--pk-border)' }}>
            <h2 style={{ color: 'var(--pk-blue-800)', fontSize: '1.5rem', margin: 0 }}>System Directory Management</h2>
        </div>
        
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--pk-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
           <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ backgroundColor: 'var(--pk-bg)', borderBottom: '1px solid var(--pk-border)' }}>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--pk-text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--pk-text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Chapter</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--pk-text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Role</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: 'var(--pk-text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {registeredUsers.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--pk-border)', transition: 'background-color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--pk-blue-50)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--pk-text-main)', fontWeight: 500 }}>{user.full_name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--pk-text-muted)' }}>{user.chapter || 'SCA Admin Team'}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                           <span style={{ padding: '0.35rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', backgroundColor: user.role === 'admin' ? '#f3e8ff' : '#e0f2fe', color: user.role === 'admin' ? '#7e22ce' : '#0369a1', border: `1px solid ${user.role === 'admin' ? '#d8b4fe' : '#bae6fd'}` }}>
                             {user.role}
                           </span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                            {user.username !== currentUser.username && (
                                <button 
                                    onClick={() => handleDeleteUser(user.username)}
                                    style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s', opacity: 0.8 }}
                                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                                    onMouseOut={e => e.currentTarget.style.opacity = 0.8}
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
                       <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--pk-text-muted)' }}>No users registered yet.</td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
}
