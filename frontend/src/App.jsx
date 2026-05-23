import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginScreen from './screen/LoginScreen'
import StudentScreen from './screen/Student/StudentScreen'
import RegisterScreen from './screen/RegisterScreen'
import MentorScreen from './screen/Mentor/MentorScreen'
import EmployerScreen from './screen/Employer/EmployerScreen'
import AdminScreen from './screen/Admin/AdminScreen'

function App() {
  const [count, setCount] = useState(0)
  
  // Initialize screen based on persistent login state
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedUserStr = localStorage.getItem('currentUser');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && (savedUser.id || savedUser.username)) {
          const role = savedUser.role || 'student';
          if (role === 'mentor') return 'mentor';
          if (role === 'admin') return 'admin';
          if (role === 'employer') return 'employer';
          return 'demo'; // defaults to student screen
        }
      } catch (e) {
        console.error('Failed to parse persistent user state', e);
      }
    }
    return 'login';
  });

  const [backendStatus, setBackendStatus] = useState('Checking...')

  // Handle navigation and logout
  const handleNavigate = (screen) => {
    if (screen === 'landing' || screen === 'login') {
      localStorage.removeItem('currentUser'); // Clear session on logout
    }
    setCurrentScreen(screen);
  };

  useEffect(() => {
    fetch('/api/health')
      .then(async res => {
        if (!res.ok) throw new Error('Not OK');
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      })
      .then(data => setBackendStatus(data.status === 'OK' ? 'Connected to Backend ✅' : 'Backend Error ❌'))
      .catch(() => setBackendStatus('Backend Not Reachable ❌'))
  }, [])

  if (currentScreen === 'login' || currentScreen === 'landing') {
    return <LoginScreen onNavigate={handleNavigate} />
  }

  if (currentScreen === 'register') {
    return <RegisterScreen onNavigate={handleNavigate} />
  }

  if (currentScreen === 'demo') {
    return <StudentScreen onNavigate={handleNavigate} />
  }

  if (currentScreen === 'mentor') {
    return <MentorScreen onNavigate={handleNavigate} />
  }

  if (currentScreen === 'employer') {
    return <EmployerScreen onNavigate={handleNavigate} />
  }

  if (currentScreen === 'admin') {
    return <AdminScreen onNavigate={handleNavigate} />
  }

  return (
    <>
      <div className="demo-header-banner">
        <button className="back-btn" onClick={() => handleNavigate('landing')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Landing</span>
        </button>
        <span className="demo-badge">Interactive Demo Mode</span>
      </div>

      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '8px', color: '#333' }}>
            <strong>Backend Status: </strong> {backendStatus}
          </div>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

