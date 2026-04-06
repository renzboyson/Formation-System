import React, { useContext } from 'react';
import { AppContext, FORMATIONS } from '../../App';
import { CalendarCheck, CheckCircle } from 'lucide-react';

export default function AdminBreakdown() {
    const { registeredUsers, activities } = useContext(AppContext);

    const sortSchools = (a, b) => {
        const chapterA = parseInt((a.chapter || '').replace(/\D/g, '') || '0');
        const chapterB = parseInt((b.chapter || '').replace(/\D/g, '') || '0');
        if (chapterA !== chapterB) return chapterA - chapterB;
        return (a.school || '').localeCompare(b.school || '');
    };

    const unitAccounts = registeredUsers.filter(u => u.role !== 'admin').sort(sortSchools);

    return (
        <div className="animation-fade-in" style={{ padding: '0 1rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: 'var(--pk-blue-800)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Journey Breakdown</h1>
                <p style={{ color: 'var(--pk-text-muted)', fontSize: '1.1rem' }}>Global matrix tracking all active formation completions.</p>
            </header>

            <section style={{ marginBottom: '4rem' }}>
                <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--pk-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--pk-gray-50)', color: 'var(--pk-blue-800)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', width: '100px' }}>Chapter</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', minWidth: '200px' }}>Unit</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', textAlign: 'center', width: '100px' }}>eSCAPade</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', textAlign: 'center', width: '100px' }}>PCM-LTW</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', textAlign: 'center', width: '100px' }}>BOW</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--pk-border)', textAlign: 'center', width: '100px' }}>SCALE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unitAccounts.map((u, i) => (
                                <tr key={i} className="hover:bg-gray-50" style={{ transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--pk-border)', color: 'var(--pk-text-muted)', fontSize: '0.9rem' }}>
                                        {u.chapter || 'N/A'}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--pk-border)', fontWeight: 600, color: 'var(--pk-text-main)' }}>
                                        {u.school || 'N/A'}
                                    </td>
                                    {FORMATIONS.map(form => {
                                        const isDone = activities.some(a => a.username === u.username && a.formationId === form.id && a.status === 'completed');
                                        return (
                                            <td key={form.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--pk-border)', textAlign: 'center' }}>
                                                {isDone ? (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <CheckCircle size={22} color="#16a34a" />
                                                    </div>
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {unitAccounts.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--pk-text-muted)' }}>No unit accounts registered yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
