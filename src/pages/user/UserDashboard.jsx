import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, FORMATIONS } from '../../App';
import { CheckCircle, Lock, CalendarPlus, Sprout, Network, Plane, Scale, Check } from 'lucide-react';

const getIcon = (id, size = 32) => {
  switch (id) {
    case 'escapade': return <Sprout size={size} />;
    case 'pcm-ltw': return <Network size={size} />;
    case 'bow': return <Plane size={size} />;
    case 'scale': return <Scale size={size} />;
    default: return <CheckCircle size={size} />;
  }
};

export default function Home() {
  const { activities, isEligible, currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  const isCompleted = (id) => activities.some(a => a.username === currentUser?.username && a.formationId === id && a.status === 'completed');

  return (
    <div className="home-dashboard">
      <h1 className="page-title">SCA Formation Journey</h1>
      <p style={{ textAlign: 'center', color: 'var(--pk-text-muted)', marginBottom: '2rem' }}>
        Your structured path towards becoming a full-fledged SCAN. Complete these steps in order.
      </p>

      <div className="ladder-container">
        {FORMATIONS.map((formation, index) => {
          const eligible = isEligible(formation.id);
          const completed = isCompleted(formation.id);
          const isUpNext = eligible && !completed;

          let statusClass = '';
          if (completed) statusClass = 'step-completed';
          else if (isUpNext) statusClass = 'step-active';
          else statusClass = 'step-locked';

          return (
            <div key={formation.id} className={`ladder-step ${statusClass}`}>
              <div className="step-circle">
                {getIcon(formation.id, 24)}
              </div>
              <div className="step-card">
                <h3>{formation.title}</h3>
                
                <div className="step-action" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {completed ? (
                    <>
                      <span className="badge badge-completed"><Check size={14} /> Completed</span>
                      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: 0, color: '#16a34a', fontWeight: 500 }}>
                        {formation.id === 'escapade' && "Congrats! You can now proceed to PCM-LTW. Keep going!"}
                        {formation.id === 'pcm-ltw' && "Awesome work! You are now cleared for BOW. You are almost there!"}
                        {formation.id === 'bow' && "Amazing! One more to go. Get ready for SCALE!"}
                        {formation.id === 'scale' && "Congratulations! You are now a full-fledged SCAN!"}
                      </p>
                    </>
                  ) : eligible ? (
                    <>
                      <span className="badge badge-pending" style={{ background: 'var(--pk-blue-100)', color: 'var(--pk-blue-700)' }}>Start here</span>
                      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: 0, color: 'var(--pk-blue-600)', fontWeight: 500 }}>
                        {formation.id === 'scale' ? "The final step! You are almost there!" : "Take your first step!"}
                      </p>
                    </>
                  ) : (
                    <span className="badge badge-locked" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', color: '#64748b', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>
                      <Lock size={14} /> Locked (Complete Previous Steps)
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
