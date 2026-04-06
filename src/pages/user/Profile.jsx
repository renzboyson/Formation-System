import React, { useContext } from 'react';
import { LogOut, Printer } from 'lucide-react';
import { AppContext } from '../../App';

export default function Profile() {
  const { currentUser, logout } = useContext(AppContext);

  if (!currentUser) return null;

  return (
    <div className="animation-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      
      <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #94a3b8', padding: '0.5rem 1rem', borderRadius: '6px', background: 'white', cursor: 'pointer', color: '#475569', fontWeight: 'bold', transition: 'all 0.2s', marginRight: '1rem' }}>
          <Printer size={18} /> Print
        </button>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #fecaca', padding: '0.5rem 1rem', borderRadius: '6px', background: '#fee2e2', cursor: 'pointer', color: '#b91c1c', fontWeight: 'bold', transition: 'all 0.2s' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '850px', background: 'white', padding: '4rem 5rem', fontFamily: '"Times New Roman", Times, serif', color: 'black', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', textDecoration: 'underline', textTransform: 'uppercase', fontWeight: 'bold' }}>SCA President's Profile</h1>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>S.Y. 2024-2025</p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ textDecoration: 'underline', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Personal Information:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, max-content) 1fr minmax(100px, max-content) 1fr', gap: '1rem', fontSize: '1.1rem', alignItems: 'end' }}>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'end', width: '100%' }}>
                      <span style={{ paddingRight: '0.5rem' }}>Name :</span>
                      <span style={{ borderBottom: '1px solid black', flex: 1, paddingLeft: '0.5rem', paddingBottom: '2px', fontWeight: 'bold' }}>{currentUser.name}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'end', width: '100%', paddingLeft: '1rem' }}>
                      <span style={{ paddingRight: '0.5rem' }}>Nick Name:</span>
                      <span style={{ borderBottom: '1px solid black', flex: 1, paddingLeft: '0.5rem', paddingBottom: '2px' }}>{currentUser.nickName}</span>
                  </div>
                  <div style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'end', width: '100%' }}>
                      <span style={{ paddingRight: '0.5rem' }}>Address:</span>
                      <span style={{ borderBottom: '1px solid black', flex: 1, paddingLeft: '0.5rem', paddingBottom: '2px' }}>{currentUser.address}</span>
                  </div>
                  {/* Empty div for grid filler if needed, but span 3 leaves 1 col, let's use span 4 slightly differently */}
                  <div style={{ gridColumn: 'span 4', display: 'flex', alignItems: 'end', width: '100%', marginTop: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '130px' }}>Email Address <span style={{ float: 'right', paddingRight: '0.5rem' }}>:</span></span>
                      <span style={{ borderBottom: '1px solid black', flex: 1, paddingLeft: '0.5rem', paddingBottom: '2px' }}>{currentUser.email}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'end', width: '100%', marginTop: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '130px' }}>Mobile Number <span style={{ float: 'right', paddingRight: '0.5rem' }}>:</span></span>
                      <span style={{ borderBottom: '1px solid black', flex: 1, paddingLeft: '0.5rem', paddingBottom: '2px' }}>{currentUser.mobile}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'end', width: '100%', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                      <span style={{ paddingRight: '0.5rem' }}>Birthdate:</span>
                      <span style={{ borderBottom: '1px solid black', flex: 1, paddingLeft: '0.5rem', paddingBottom: '2px' }}>{currentUser.birthdate}</span>
                  </div>
              </div>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
              <h3 style={{ textDecoration: 'underline', fontSize: '1.1rem', marginBottom: '1.5rem' }}>SCA Membership:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                      <span style={{ paddingRight: '0.5rem' }}>Unit:</span>
                      <span style={{ borderBottom: '1px solid black', width: '50%', paddingLeft: '0.5rem', paddingBottom: '2px', fontWeight: 'bold' }}>{currentUser.school}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                      <span style={{ paddingRight: '0.5rem' }}>Chapter:</span>
                      <span style={{ borderBottom: '1px solid black', width: '50%', paddingLeft: '0.5rem', paddingBottom: '2px', fontWeight: 'bold' }}>{currentUser.chapter}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                      <span style={{ paddingRight: '0.5rem' }}>No. of Years(as President):</span>
                      <span style={{ borderBottom: '1px solid black', width: '20%', paddingLeft: '0.5rem', paddingBottom: '2px', textAlign: 'center' }}>{currentUser.yearsPresident}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                      <span style={{ paddingRight: '0.5rem' }}>No. of Years(as SCAn):</span>
                      <span style={{ borderBottom: '1px solid black', width: '20%', paddingLeft: '0.5rem', paddingBottom: '2px', textAlign: 'center' }}>{currentUser.yearsSCAn}</span>
                  </div>
              </div>
          </div>

          <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', fontWeight: 'bold' }}><span style={{ textDecoration: 'underline' }}>Other Involvement</span> <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(School, Parish, Community):</span></h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', fontSize: '1.1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '250px' }}>
                      <span style={{ marginBottom: '0.5rem' }}>Organization</span>
                      {currentUser.involvements && currentUser.involvements.length > 0 ? currentUser.involvements.map((inv, idx) => (
                          <div key={idx} style={{ borderBottom: '1px solid black', minHeight: '1.5rem', display: 'flex', alignItems: 'end', paddingBottom: '2px' }}>{inv.organization || ' '}</div>
                      )) : (
                          <>
                              <div style={{ borderBottom: '1px solid black', minHeight: '1.5rem' }}></div>
                              <div style={{ borderBottom: '1px solid black', minHeight: '1.5rem' }}></div>
                              <div style={{ borderBottom: '1px solid black', minHeight: '1.5rem' }}></div>
                          </>
                      )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '250px' }}>
                      <span style={{ marginBottom: '0.5rem' }}>Position</span>
                      {currentUser.involvements && currentUser.involvements.length > 0 ? currentUser.involvements.map((inv, idx) => (
                          <div key={idx} style={{ borderBottom: '1px solid black', minHeight: '1.5rem', display: 'flex', alignItems: 'end', paddingBottom: '2px' }}>{inv.position || ' '}</div>
                      )) : (
                          <>
                              <div style={{ borderBottom: '1px solid black', minHeight: '1.5rem' }}></div>
                              <div style={{ borderBottom: '1px solid black', minHeight: '1.5rem' }}></div>
                              <div style={{ borderBottom: '1px solid black', minHeight: '1.5rem' }}></div>
                          </>
                      )}
                  </div>
              </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>For me, the top five qualities of SCA Leader are:</p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', fontSize: '1.1rem' }}>
                  {currentUser.qualities && currentUser.qualities.length > 0 ? currentUser.qualities.map((q, idx) => (
                      <div key={idx} style={{ borderBottom: '1px solid black', width: '500px', minHeight: '1.5rem', display: 'flex', alignItems: 'end', textAlign: 'left', paddingBottom: '2px', paddingLeft: '1rem' }}>{q || ' '}</div>
                  )) : (
                      <>
                          <div style={{ borderBottom: '1px solid black', width: '500px', minHeight: '1.5rem' }}></div>
                          <div style={{ borderBottom: '1px solid black', width: '500px', minHeight: '1.5rem' }}></div>
                          <div style={{ borderBottom: '1px solid black', width: '500px', minHeight: '1.5rem' }}></div>
                          <div style={{ borderBottom: '1px solid black', width: '500px', minHeight: '1.5rem' }}></div>
                          <div style={{ borderBottom: '1px solid black', width: '500px', minHeight: '1.5rem' }}></div>
                      </>
                  )}
              </div>
          </div>

      </div>
    </div>
  );
}
