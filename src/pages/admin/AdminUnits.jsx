import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { School, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminUnits() {
  const { registeredUsers, approveUser, rejectUser } = useContext(AppContext);

  const sortSchools = (a, b) => {
    const chapterA = parseInt((a.chapter || '').replace(/\D/g, '') || '0');
    const chapterB = parseInt((b.chapter || '').replace(/\D/g, '') || '0');
    if (chapterA !== chapterB) return chapterA - chapterB;
    return (a.school || '').localeCompare(b.school || '');
  };

  const pendingAccounts = registeredUsers.filter(u => u.status === 'pending').sort(sortSchools);
  const unitAccounts = registeredUsers.filter(u => u.role !== 'admin' && u.status !== 'pending').sort(sortSchools);

  return (
    <div className="animation-fade-in" style={{ padding: '0 1rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ color: 'var(--pk-blue-800)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Unit Accounts</h1>
        <p style={{ color: 'var(--pk-text-muted)', fontSize: '1.1rem' }}>SCA Directory mapping participating units hierarchically.</p>
      </header>

      {pendingAccounts.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#b91c1c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={24} /> Pending Approvals ({pendingAccounts.length})
          </h2>
          <div style={{ overflowX: 'auto', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #fecaca' }}>Chapter</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #fecaca' }}>Unit</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #fecaca' }}>President Name</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #fecaca', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAccounts.map((u, i) => (
                  <tr key={i} style={{ transition: 'all 0.2s' }}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #fecaca', color: '#7f1d1d' }}>{u.chapter || 'N/A'}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #fecaca', fontWeight: 600, color: '#7f1d1d' }}>{u.school || 'N/A'}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #fecaca', color: '#7f1d1d' }}>{u.full_name || 'N/A'}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #fecaca', textAlign: 'right' }}>
                        <button onClick={() => approveUser(u.username)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'filter 0.1s' }} onMouseOver={e=>e.currentTarget.style.filter='brightness(1.1)'} onMouseOut={e=>e.currentTarget.style.filter='none'}><CheckCircle size={16} /> Approve</button>
                        <button onClick={() => { if(window.confirm('Are you sure you want to reject this account?')) rejectUser(u.username); }} style={{ background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'background 0.1s' }} onMouseOver={e=>e.currentTarget.style.background='#fef2f2'} onMouseOut={e=>e.currentTarget.style.background='white'}><XCircle size={16} /> Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--pk-blue-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <School size={24} /> Approved Units
        </h2>
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--pk-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--pk-gray-50)', color: 'var(--pk-blue-800)', fontSize: '0.9rem' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Chapter</div>
                </th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)' }}>Unit</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)' }}>President Name</th>
              </tr>
            </thead>
            <tbody>
              {unitAccounts.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50" style={{ transition: 'all 0.2s' }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', color: 'var(--pk-text-muted)' }}>{u.chapter || 'N/A'}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', fontWeight: 600, color: 'var(--pk-text-main)' }}>{u.school || 'N/A'}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', color: 'var(--pk-text-muted)' }}>{u.full_name || 'N/A'}</td>
                </tr>
              ))}
              {unitAccounts.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--pk-text-muted)' }}>No unit accounts registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
