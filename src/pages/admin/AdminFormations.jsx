import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { Check, X, CheckCircle, Activity, FileImage, Clock } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';

export default function AdminFormations() {
    const { activities, updateActivityStatus } = useContext(AppContext);
    const [previewImage, setPreviewImage] = useState(null);
    const pendingActivities = activities.filter(a => a.status === 'pending');

    return (
        <div className="animation-fade-in" style={{ padding: '0 1rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: 'var(--pk-blue-800)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Formations Manager</h1>
                <p style={{ color: 'var(--pk-text-muted)', fontSize: '1.1rem' }}>Approve, Reject, and Finalize schedules here.</p>
            </header>

            {/* Formations Master Bar */}
            <section style={{ marginBottom: '3rem', backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid var(--pk-border)' }}>
                <h2 style={{ color: 'var(--pk-blue-800)', marginBottom: '2rem', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Activity size={28} /> Formations
                </h2>

                {/* Pending Formation Schedules */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ color: 'var(--pk-blue-700)', marginBottom: '1rem', fontSize: '1.25rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                        Pending Formation Schedules
                    </h3>
                    {pendingActivities.length === 0 ? (
                        <div style={{ padding: '2rem', backgroundColor: 'var(--pk-gray-50)', border: '1px solid var(--pk-border)', borderRadius: '12px', textAlign: 'center', color: 'var(--pk-text-muted)' }}>
                            No pending schedules require approval at this time.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {pendingActivities.map(activity => (
                                <div key={activity.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--pk-border)' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--pk-blue-800)' }}>{activity.userName || 'System User'}</span>
                                            <span style={{ color: 'var(--pk-text-muted)' }}>({activity.schoolName || 'Unknown Unit'})</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--pk-text-main)' }}>{activity.formationTitle}</h4>
                                        <p style={{ margin: 0, color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            Requested: {format(new Date(activity.date), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        
                                        {activity.approvalLetter && (
                                            <button 
                                                onClick={() => setPreviewImage(activity.approvalLetter)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--pk-gray-50)', border: '1px solid var(--pk-border)', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--pk-blue-600)', fontSize: '0.9rem', width: '100%', justifyContent: 'center', transition: 'all 0.2s' }}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--pk-blue-50)'; e.currentTarget.style.borderColor = 'var(--pk-blue-200)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--pk-gray-50)'; e.currentTarget.style.borderColor = 'var(--pk-border)'; }}
                                            >
                                                <FileImage size={16} /> View Approval Letter
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                        <button
                                            onClick={() => updateActivityStatus(activity.id, 'approved')}
                                            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            <Check size={18} /> Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to permanently reject and delete this request?")) {
                                                    updateActivityStatus(activity.id, 'rejected');
                                                }
                                            }}
                                            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            <X size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active & Approved Formations */}
                <div>
                    <h3 style={{ color: '#047857', marginBottom: '1rem', fontSize: '1.25rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={22} />
                        Active & Approved
                    </h3>
                    {activities.filter(a => a.status === 'approved').length === 0 ? (
                        <div style={{ padding: '2rem', backgroundColor: 'var(--pk-gray-50)', border: '1px solid var(--pk-border)', borderRadius: '12px', textAlign: 'center', color: 'var(--pk-text-muted)' }}>
                            No active approved schedules waiting to be completed.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {activities.filter(a => a.status === 'approved').sort((a, b) => new Date(a.date) - new Date(b.date)).map(activity => (
                                <div key={activity.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 600, color: '#065f46' }}>{activity.userName || 'System User'}</span>
                                            <span style={{ color: '#047857', opacity: 0.8 }}>({activity.schoolName || 'Unknown Unit'})</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#064e3b' }}>{activity.formationTitle}</h4>
                                        <p style={{ margin: 0, color: '#065f46', fontSize: '0.9rem', fontWeight: 500 }}>
                                            Date: {format(new Date(activity.date), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                    </div>
                                    {isBefore(startOfDay(new Date(activity.date)), startOfDay(new Date())) ? (
                                        <button
                                            onClick={() => updateActivityStatus(activity.id, 'completed')}
                                            style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; }}
                                        >
                                            <CheckCircle size={18} /> Mark as Completed
                                        </button>
                                    ) : (
                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#e2e8f0', color: '#64748b', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'not-allowed' }}>
                                            <Clock size={18} /> Awaits Completion Time
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Image Preview Modal */}
            {previewImage && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <div className="animation-fade-up" style={{ position: 'relative', background: 'white', borderRadius: '12px', padding: '1.5rem', maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--pk-blue-800)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileImage size={20} />
                                Approval Letter Preview
                            </h3>
                            <button onClick={() => setPreviewImage(null)} style={{ background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0.5rem', borderRadius: '50%', display: 'flex' }} title="Close Preview">
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', padding: '0.5rem' }}>
                            <img src={previewImage} alt="Approval Letter" style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
