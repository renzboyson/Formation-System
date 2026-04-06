import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';

export default function Landing() {
  const { registerUser, attemptLogin, registeredUsers } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [pendingUsername, setPendingUsername] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', nickName: '', address: '', email: '', mobile: '', birthdate: '',
    school: '', chapter: '', yearsPresident: '', yearsSCAn: '',
    involvements: [
       { organization: '', position: '' },
       { organization: '', position: '' },
       { organization: '', position: '' }
    ],
    qualities: ['', '', '', '', ''],
    username: '', password: ''
  });

  const clearError = () => setError('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    clearError();
    if (!loginForm.username || !loginForm.password) return setError('Please fill in all required fields');
    
    const result = attemptLogin(loginForm.username, loginForm.password);
    if (!result.success) {
      setError(result.message);
    }
  };

  useEffect(() => {
    let interval;
    if (pendingUsername) {
      interval = setInterval(() => {
        const users = JSON.parse(localStorage.getItem('sca_registeredUsers') || '[]');
        const pUser = users.find(u => u.username === pendingUsername);
        
        if (pUser && pUser.status === 'approved') {
          // Automatic login triggered!
          setPendingUsername(null);
          attemptLogin(pUser.username, pUser.password);
        } else if (!pUser) {
           setPendingUsername(null);
           setError("Your registration request was rejected by the Admin.");
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [pendingUsername, attemptLogin]);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    clearError();
    const sf = signupForm;
    if (!sf.name || !sf.chapter || !sf.school || !sf.username || !sf.password) {
      return setError("Please fill up all required fields.");
    }
    
    // Check if username is already taken
    const exists = registeredUsers.some(u => u.username === sf.username);
    if (exists) {
      return setError("That username is already taken. Please choose another one.");
    }

    registerUser({
      name: sf.name,
      nickName: sf.nickName,
      address: sf.address,
      email: sf.email,
      mobile: sf.mobile,
      birthdate: sf.birthdate,
      school: sf.school,
      chapter: `Chapter ${sf.chapter.replace(/\D/g, '')}`, // Strips out everything except digits
      yearsPresident: sf.yearsPresident,
      yearsSCAn: sf.yearsSCAn,
      involvements: sf.involvements,
      qualities: sf.qualities,
      role: "SCA President",
      username: sf.username,
      password: sf.password
    });

    setPendingUsername(sf.username);
    setIsLogin(true);
    setLoginForm({ username: sf.username, password: sf.password });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page" style={{ 
       '--primary-color': 'var(--pk-blue-800)',
       '--primary-light': 'var(--pk-blue-600)',
       '--primary-dark': 'var(--pk-blue-900)',
       '--secondary-color': 'var(--pk-white)',
       '--text-color': 'var(--pk-text-main)',
       '--text-light': 'var(--pk-text-muted)',
       '--bg-color': 'var(--pk-gray-50)',
       '--border-color': 'var(--pk-border)',
       '--font-family': "'Inter', sans-serif"
    }}>
        <style>{`
          
        `}</style>
        <header className="landing-global-header">
            <div className="container header-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/logo1.jpg" alt="SCA Logo" style={{ height: '50px', width: 'auto', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                    <h1 className="logo-text" style={{ margin: 0 }}>Student Catholic Action (SCA)</h1>
                </div>
                <nav>
                    <ul className="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#auth" id="nav-login-btn" onClick={() => setIsLogin(true)}>Login / Sign Up</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <main>
            <section id="home" className="hero">
                <div className="container">
                    <h2>Welcome to SCA Management System</h2>
                    <p>Building a community of young disciples</p>
                </div>
            </section>

            <section id="about" className="about">
                <div className="container">
                    <h2>About Us</h2>
                    <div className="about-content">
                        <p className="about-text">
                            “Student Catholic Action is an organized group of students striving to become a community of disciples of Christ who are evangelized and evangelizing.”
                        </p>
                    </div>
                </div>
            </section>

            <section id="auth" className="auth-section">
                <div className="container container-sm">
                    <div className="auth-box">
                        <div className="auth-header">
                            <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); clearError(); }}>Login</button>
                            <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); clearError(); }}>Sign Up</button>
                        </div>
                        
                        {error && (
                          <div className="form-error animation-fade-in" style={{ margin: '20px 30px 0 30px' }}>
                            {error}
                          </div>
                        )}

                        {isLogin ? (
                          pendingUsername ? (
                             <div className="auth-form animation-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                 <h3 style={{ color: 'var(--pk-blue-800)', marginBottom: '1rem', fontSize: '1.5rem' }}>Registration Successful!</h3>
                                 <p style={{ marginBottom: '2rem', color: 'var(--pk-text-main)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                                     Please wait for the administrator to approve your account before logging in.
                                 </p>
                                 <div className="form-group" style={{ textAlign: 'left' }}>
                                     <label style={{ color: 'var(--pk-text-muted)' }}>Username</label>
                                     <input type="text" value={pendingUsername} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' }} />
                                 </div>
                                 <div className="form-group" style={{ textAlign: 'left', position: 'relative' }}>
                                     <label style={{ color: 'var(--pk-text-muted)' }}>Password</label>
                                     <input type="password" value="********" disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' }} />
                                 </div>
                                 <button type="button" disabled className="btn btn-block" style={{ backgroundColor: '#94a3b8', color: 'white', cursor: 'wait', marginTop: '1rem' }}>
                                     Waiting for Admin Approval...
                                 </button>
                                 <p className="form-footer" style={{ marginTop: '2rem' }}>
                                    <span style={{color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold'}} onClick={() => { setPendingUsername(null); }}>Cancel & Back to Login</span>
                                 </p>
                             </div>
                          ) : (
                            <form onSubmit={handleLoginSubmit} className="auth-form animation-fade-in">
                                <h3>Login to your account</h3>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} required placeholder="Enter your username" />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required placeholder="Enter your password" />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Login</button>
                                <p className="form-footer">Don't have an account? <span style={{color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => { setIsLogin(false); clearError(); }}>Sign up</span></p>
                            </form>
                          )
                        ) : (
                          <form onSubmit={handleSignupSubmit} className="auth-form animation-fade-in">
                              <h3>Create an account</h3>
                              
                              <fieldset>
                                  <legend>Personal Information</legend>
                                  <div className="form-group">
                                      <label>Name</label>
                                      <input type="text" value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} required placeholder="Full Name" />
                                  </div>
                                  <div className="form-group">
                                      <label>Nick Name</label>
                                      <input type="text" value={signupForm.nickName} onChange={e => setSignupForm({...signupForm, nickName: e.target.value})} required placeholder="Nick Name" />
                                  </div>
                                  <div className="form-group">
                                      <label>Address</label>
                                      <input type="text" value={signupForm.address} onChange={e => setSignupForm({...signupForm, address: e.target.value})} required placeholder="Complete Address" />
                                  </div>
                                  <div className="form-group">
                                      <label>Email Address</label>
                                      <input type="email" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email: e.target.value})} required placeholder="Email Address" />
                                  </div>
                                  <div className="form-row">
                                      <div className="form-group">
                                          <label>Mobile Number</label>
                                          <input type="text" value={signupForm.mobile} onChange={e => setSignupForm({...signupForm, mobile: e.target.value})} required placeholder="Mobile Number" />
                                      </div>
                                      <div className="form-group">
                                          <label>Birthdate</label>
                                          <input type="date" value={signupForm.birthdate} onChange={e => setSignupForm({...signupForm, birthdate: e.target.value})} required />
                                      </div>
                                  </div>
                              </fieldset>

                              <fieldset>
                                  <legend>SCA Membership</legend>
                                  <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <input type="text" value={signupForm.school} onChange={e => setSignupForm({...signupForm, school: e.target.value})} required placeholder="Unit Name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Chapter (1-5)</label>
                                        <input type="text" value={signupForm.chapter} onChange={e => setSignupForm({...signupForm, chapter: e.target.value})} required placeholder="Chapter 1" />
                                    </div>
                                  </div>
                                  <div className="form-row">
                                      <div className="form-group">
                                          <label>No. of Years (as President)</label>
                                          <input type="number" value={signupForm.yearsPresident} onChange={e => setSignupForm({...signupForm, yearsPresident: e.target.value})} required placeholder="Years" />
                                      </div>
                                      <div className="form-group">
                                          <label>No. of Years (as SCAn)</label>
                                          <input type="number" value={signupForm.yearsSCAn} onChange={e => setSignupForm({...signupForm, yearsSCAn: e.target.value})} required placeholder="Years" />
                                      </div>
                                  </div>
                              </fieldset>

                              <fieldset>
                                  <legend>Other Involvement (School, Parish, Community)</legend>
                                  {[0, 1, 2].map(index => (
                                      <div className="form-row" key={index} style={{marginBottom: '0.5rem'}}>
                                          <div className="form-group" style={{marginBottom: 0}}>
                                              <input type="text" value={signupForm.involvements[index].organization} onChange={e => {
                                                  const newInv = [...signupForm.involvements];
                                                  newInv[index].organization = e.target.value;
                                                  setSignupForm({...signupForm, involvements: newInv});
                                              }} placeholder={`Organization ${index + 1}`} />
                                          </div>
                                          <div className="form-group" style={{marginBottom: 0}}>
                                              <input type="text" value={signupForm.involvements[index].position} onChange={e => {
                                                  const newInv = [...signupForm.involvements];
                                                  newInv[index].position = e.target.value;
                                                  setSignupForm({...signupForm, involvements: newInv});
                                              }} placeholder={`Position ${index + 1}`} />
                                          </div>
                                      </div>
                                  ))}
                              </fieldset>

                              <fieldset>
                                  <legend>For me, the top five qualities of SCA Leader are:</legend>
                                  {[0, 1, 2, 3, 4].map(index => (
                                      <div className="form-group" key={index} style={{marginBottom: '0.5rem'}}>
                                          <input type="text" value={signupForm.qualities[index]} onChange={e => {
                                              const newQual = [...signupForm.qualities];
                                              newQual[index] = e.target.value;
                                              setSignupForm({...signupForm, qualities: newQual});
                                          }} placeholder={`Quality ${index + 1}`} />
                                      </div>
                                  ))}
                              </fieldset>

                              <fieldset>
                                  <legend>Account Credentials</legend>
                                  <div className="form-row">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input type="text" value={signupForm.username} onChange={e => setSignupForm({...signupForm, username: e.target.value})} required placeholder="Choose a username" />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} required placeholder="Choose a password" />
                                    </div>
                                  </div>
                              </fieldset>

                              <button type="submit" className="btn btn-primary btn-block" style={{marginTop:'1.5rem'}}>Submit</button>
                              <p className="form-footer">Already have an account? <span style={{color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => { setIsLogin(true); clearError(); }}>Login</span></p>
                          </form>
                        )}
                    </div>
                </div>
            </section>
        </main>

        <footer>
            <div className="container footer-container">
                <h3 className="footer-heading">Stay Connected</h3>
                <div className="footer-links" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
                    <p style={{margin: 0}}><strong>Facebook page:</strong> <a href="#" target="_blank">Student Catholic Action-Diocese of Tagbilaran</a></p>
                    <p style={{margin: 0}}><strong>Phone Number:</strong> 0963-7946-857</p>
                </div>
                <div className="footer-bottom">
                    <p style={{margin: 0}}>&copy; 2026 Student Catholic Action. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
  );
}
