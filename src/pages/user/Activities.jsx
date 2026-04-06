import React, { useContext, useState } from 'react';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { ListChecks, Hourglass, CalendarCheck, CheckCircle, Calendar, X, Bell, Sprout, Network, Plane, Scale } from 'lucide-react';
import { AppContext } from '../../App';

const getIcon = (id) => {
  switch (id) {
    case 'escapade': return <Sprout size={24} />;
    case 'pcm-ltw': return <Network size={24} />;
    case 'bow': return <Plane size={24} />;
    case 'scale': return <Scale size={24} />;
    default: return <CheckCircle size={24} />;
  }
};

const CHAPTER_CONTACTS = {
  "Chapter 1": [
    { name: "Lucille Anne Ticon (Ate Anne)", phone: "09928799973" },
    { name: "Katrina Agosto (Ate Kat)", phone: "09165331494" }
  ],
  "Chapter 2": [
    { name: "Andrea Mae G. Valencia (Ate Andrea)", phone: "09650498671" },
    { name: "Edilyn Bea O. Payumo (Ate Dilyn)", phone: "09352176592" }
  ],
  "Chapter 3": [
    { name: "Von Claire Pitogo (Ate Von)", phone: "09198975375" },
    { name: "Niña Haidee Mae Absin (Ate Haidee)", phone: "09705353597" }
  ],
  "Chapter 4": [
    { name: "Kian Ernest Lamoste (Kuya Kian)", phone: "09705644245" },
    { name: "Marcel Anne Balicog (Ate Marcel)", phone: "09384136155" }
  ],
  "Chapter 5": [
    { name: "Mae Angela D. Alac (Ate Mae An)", phone: "09275681813" },
    { name: "Neil Jenry Caga (Kuya Neil)", phone: "09544060564" }
  ],
  "Chapter 6": [
    { name: "Mariel Munta (Ate Mariel)", phone: "09635329547" },
    { name: "Diogenes Igcalinos Jr (K'Deo)", phone: "09702890130" }
  ],
  "Chapter 7": [
    { name: "Angelo L. Lanquino (Kuya Gelo)", phone: "09060337813" },
    { name: "Vanessa Mae I Tac-an (Ate Van)", phone: "09814474940" }
  ]
};

export default function Activities() {
  const { activities, cancelActivity, currentUser } = useContext(AppContext);
  const [expandedReminder, setExpandedReminder] = useState(null);

  const userActivities = activities.filter(a => a.username === currentUser?.username);

  const pending = userActivities.filter(a => a.status === 'pending').sort((a, b) => new Date(a.date) - new Date(b.date));
  const approved = userActivities.filter(a => a.status === 'approved').sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = userActivities.filter(a => a.status === 'completed').sort((a, b) => new Date(b.date) - new Date(a.date));

  // Determine if cancel is allowed 
  // (allowed if difference between today and schedule date is <= 1 day, i.e., up to 1 day after event)
  const canCancel = (dateStr) => {
     return differenceInDays(startOfDay(new Date()), startOfDay(new Date(dateStr))) <= 1;
  };

  const chapterContacts = currentUser?.chapter ? CHAPTER_CONTACTS[currentUser.chapter] : null;

  return (
    <div>
      <h1 className="page-title"><ListChecks size={32} /> My Activities</h1>

      <div className="activities-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* Pending Approval Section */}
        <div className="activity-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--pk-blue-800)', borderBottom: '2px solid var(--pk-border)', paddingBottom: '0.5rem' }}>
            <Hourglass className="text-blue-500" size={24} />
            Pending Approval ({pending.length})
          </h3>
          <div className="activity-list">
            {pending.length === 0 ? (
              <p style={{ color: 'var(--pk-text-muted)', textAlign: 'center', padding: '2rem 0' }}>No schedules pending approval.</p>
            ) : (
              pending.map(activity => (
                <div key={activity.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="activity-item">
                    <div className="activity-icon">
                      {getIcon(activity.icon)}
                    </div>
                    <div className="activity-info">
                      <h4>{activity.formationTitle}</h4>
                      <p>
                        <Calendar size={16} />
                        {format(new Date(activity.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-pending">Waiting For Admin</span>
                      {canCancel(activity.date) && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this request?")) {
                              cancelActivity(activity.id)
                            }
                          }}
                          style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Cancel Reservation"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Approved Section */}
        <div className="activity-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', borderBottom: '2px solid var(--pk-border)', paddingBottom: '0.5rem' }}>
            <CalendarCheck size={24} />
            Active & Approved Formations ({approved.length})
          </h3>
          <div className="activity-list">
            {approved.length === 0 ? (
              <p style={{ color: 'var(--pk-text-muted)', textAlign: 'center', padding: '2rem 0' }}>No approved schedules active.</p>
            ) : (
              approved.map(activity => (
                <div key={activity.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="activity-item completed" style={{ borderColor: '#a7f3d0', backgroundColor: '#f0fdf4' }}>
                    <div className="activity-icon" style={{ backgroundColor: '#10b981', color: 'white' }}>
                      {getIcon(activity.icon)}
                    </div>
                    <div className="activity-info">
                      <h4 style={{ color: '#064e3b' }}>{activity.formationTitle}</h4>
                      <p style={{ color: '#065f46' }}>
                        <CalendarCheck size={16} />
                        {format(new Date(activity.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-completed" style={{ background: '#10b981', color: 'white', border: 'none' }}>Official</span>
                      <button
                        onClick={() => setExpandedReminder(expandedReminder === activity.id ? null : activity.id)}
                        style={{ background: expandedReminder === activity.id ? '#d1fae5' : 'white', border: '1px solid #6ee7b7', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#047857', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Show Reminders"
                      >
                        <Bell size={16} />
                      </button>
                      {canCancel(activity.date) && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this approved schedule? You will need to re-schedule.")) {
                              cancelActivity(activity.id)
                            }
                          }}
                          style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Cancel Schedule"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {expandedReminder === activity.id && (
                    <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #6ee7b7', marginLeft: '1rem', marginRight: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                      <h5 style={{ color: '#065f46', fontSize: '1.05rem', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={18} /> 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥𝗦
                      </h5>
                      <p style={{ fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--pk-text-main)' }}>Please prepare the following:</p>
                      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', margin: '0 0 1.5rem 0', color: 'var(--pk-text-muted)', lineHeight: '1.6' }}>
                        <li>Approval Letter</li>
                        <li>Nametags (for the Trainees)</li>
                        <li>Certificates (for Trainees and Facilitators)</li>
                        <li>Laptop and Projector (if available)</li>
                        <li>Bluetooth Speaker and Microphone (if available)</li>
                        <li>Bible</li>
                        <li>Chalks and Markers</li>
                        <li>Masking Tape (or any kind)</li>
                        <li>Manila papers / Cartolina</li>
                        <li>Meals and Refund (for Facilitators)</li>
                      </ul>

                      {chapterContacts ? (
                        <>
                          <h6 style={{ color: 'var(--pk-text-main)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem 0', fontWeight: 600 }}>Your Chapter Contacts ({currentUser.chapter}):</h6>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: 'var(--pk-text-muted)', backgroundColor: 'var(--pk-gray-50)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--pk-border)' }}>
                            {chapterContacts.map((contact, i) => (
                              <div key={i}>
                                <strong style={{ color: 'var(--pk-blue-700)' }}>{contact.name}</strong><br />
                                {contact.phone}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                         <div style={{ fontSize: '0.85rem', color: 'var(--pk-text-muted)', fontStyle: 'italic' }}>
                           No specific chapter contacts found for your account. Please reach out to central Admin.
                         </div>
                      )}

                      <p style={{ fontWeight: 700, fontStyle: 'italic', margin: '1.5rem 0 0 0', textAlign: 'center', color: '#047857', borderTop: '1px solid #bbf7d0', paddingTop: '1rem' }}>
                        TO CHRIST THE KING, LOVE AND LOYALTY
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed History Section */}
        <div className="activity-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--pk-blue-600)', borderBottom: '2px solid var(--pk-border)', paddingBottom: '0.5rem' }}>
            <CheckCircle size={24} />
            Completed Formations ({completed.length})
          </h3>
          <div className="activity-list">
            {completed.length === 0 ? (
              <p style={{ color: 'var(--pk-text-muted)', textAlign: 'center', padding: '2rem 0' }}>No completed activities yet.</p>
            ) : (
              completed.map(activity => (
                <div className="activity-item completed" key={activity.id} style={{ opacity: 0.8, filter: 'grayscale(0.5)' }}>
                  <div className="activity-icon">
                    {getIcon(activity.icon)}
                  </div>
                  <div className="activity-info">
                    <h4>{activity.formationTitle}</h4>
                    <p>
                      <CheckCircle size={16} />
                      Completed on {format(new Date(activity.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="badge badge-completed">Done</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
