import { useState, useEffect } from 'react'
import './App.css'
import LoginScreen from './screen/LoginScreen'
import LandingScreen from './screen/LandingScreen'
import StudentScreen from './screen/Student/StudentScreen'
import RegisterScreen from './screen/RegisterScreen'
import MentorScreen from './screen/Mentor/MentorScreen'
import EmployerScreen from './screen/Employer/EmployerScreen'
import AdminScreen from './screen/Admin/AdminScreen'

function App() {
  
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
      .catch((e) => console.error('Backend Not Reachable', e))
  }, [])

  if (currentScreen === 'login') {
    return <LoginScreen onNavigate={handleNavigate} />
  }

  if (currentScreen === 'landing') {
    return <LandingScreen onNavigate={handleNavigate} />
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

  // Fallback
  return <LandingScreen onNavigate={handleNavigate} />
}

export default App

