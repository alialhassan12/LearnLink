import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Aos from "aos"
import "aos/dist/aos.css"
import Login from './Pages/Login';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import StudentDashboard from './Pages/StudentDashboard';
import TeacherDashboard from './Pages/TeacherDashboard';

function App() {
  const {authUser, isCheckingAuth, checkAuth} = useAuthStore();

  Aos.init({
    duration: 1000,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  // Wrapper for routes that require the user to be logged in
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isCheckingAuth) {
      return (
        <div className='flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
        </div>
      );
    }
    if (!authUser) {
      return <Navigate to="/auth/login" />;
    }
    return <>{children}</>;
  };

  // Wrapper for routes that logged-in users shouldn't see (like Login page)
  const GuestRoute = ({ children }: { children: React.ReactNode }) => {
    if (isCheckingAuth) {
      return (
        <div className='flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
        </div>
      );
    }
    if (authUser) {
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        {/* Public Route - Loads instantly without waiting for auth check */}
        <Route path='/' element={<LandingPage/>}></Route>
        
        {/* Guest Route - Redirects to dashboard if already logged in */}
        <Route path='/auth/login' element={
          <GuestRoute>
            <Login/>
          </GuestRoute>
        }></Route>

        {/* Protected Route - Requires login */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            {authUser?.role === 'student' ? <StudentDashboard/> : <TeacherDashboard/>}
          </ProtectedRoute>
        }></Route>
      </Routes>
    </>
  )
}

export default App
