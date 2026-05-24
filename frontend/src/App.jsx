import { useState, useEffect } from 'react'
import './App.css'
import LoginScreen from './screen/LoginScreen'
import LandingScreen from './screen/LandingScreen'
import StudentScreen from './screen/Student/StudentScreen'
import RegisterScreen from './screen/RegisterScreen'
import MentorScreen from './screen/Mentor/MentorScreen'
import EmployerScreen from './screen/Employer/EmployerScreen'
import AdminScreen from './screen/Admin/AdminScreen'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

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
    return 'landing';
  });

  // Handle navigation and logout
  const handleNavigate = (screen) => {
    if (screen === 'logout') {
      localStorage.removeItem('currentUser'); // Clear session on logout
      sessionStorage.removeItem('studentActiveTab');
      sessionStorage.removeItem('mentorActiveTab');
      sessionStorage.removeItem('adminActiveTab');
      setCurrentScreen('landing');
      return;
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

  const renderScreen = () => {
    if (currentScreen === 'login') return <LoginScreen onNavigate={handleNavigate} />
    if (currentScreen === 'landing') return <LandingScreen onNavigate={handleNavigate} />
    if (currentScreen === 'register') return <RegisterScreen onNavigate={handleNavigate} />
    if (currentScreen === 'demo') return <StudentScreen onNavigate={handleNavigate} />
    if (currentScreen === 'mentor') return <MentorScreen onNavigate={handleNavigate} />
    if (currentScreen === 'employer') return <EmployerScreen onNavigate={handleNavigate} />
    if (currentScreen === 'admin') return <AdminScreen onNavigate={handleNavigate} />
    return <LandingScreen onNavigate={handleNavigate} />
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="app-container">
          {renderScreen()}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
