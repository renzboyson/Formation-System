import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarPlus, CheckCircle, Sprout, Network, Plane, Scale, Lock } from 'lucide-react';
import { AppContext, FORMATIONS } from '../../App';

const getIcon = (id) => {
  switch (id) {
    case 'escapade': return <Sprout size={32} />;
    case 'pcm-ltw': return <Network size={32} />;
    case 'bow': return <Plane size={32} />;
    case 'scale': return <Scale size={32} />;
    default: return <CheckCircle size={32} />;
  }
};

export default function FormationList() {
  const { isEligible } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title"><BookOpen size={32} /> Unit Formations</h1>
      <div className="formation-grid">
        {FORMATIONS.map(formation => (
          <div className="formation-card" key={formation.id}>
            <div className="formation-icon">
              {getIcon(formation.id)}
            </div>
            <h3 className="formation-title">{formation.title}</h3>
            <p className="formation-desc">{formation.desc}</p>
            {isEligible(formation.id) ? (
              <button
                className="btn-primary"
                onClick={() => navigate(`/user/formation/${formation.id}`)}
              >
                <CalendarPlus size={20} /> Schedule
              </button>
            ) : (
              <button
                className="btn-primary"
                disabled
                style={{ background: '#cbd5e1', cursor: 'not-allowed', borderColor: '#cbd5e1' }}
                title="You must complete the previous formation first."
              >
                <Lock size={20} /> Locked
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
