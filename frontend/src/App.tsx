import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Aos from "aos"
import "aos/dist/aos.css"
import Login from './Pages/Login';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import StudentMarketPlace from './Pages/StudentMarketPlace';
import TeacherDashboard from './Pages/TeacherDashboard';
import Register from './Pages/Register';
import { Toaster } from "./components/ui/sonner";

// Wrapper for routes that require the user to be logged in
const ProtectedRoute = ({ children,allowedRoles }: { children: React.ReactNode,allowedRoles:[string] }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
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
  // check if the user has access to the route
  if(allowedRoles && !allowedRoles.includes(authUser.role)){
    return <Navigate to="/"/>
  }
  return <>{children}</>;
};

// Wrapper for routes that logged-in users shouldn't see (like Login page)
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }
  if (authUser) {
    if(authUser.role==='teacher') return <Navigate to="/dashboard"/>;
    if(authUser.role==='student') return <Navigate to="/marketplace"/>;
  }
  return <>{children}</>;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    Aos.init({
      duration: 1000
    });
    checkAuth();
  }, []);

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
        <Route path='/auth/register' element={
          <GuestRoute>
            <Register/>
          </GuestRoute>
        }></Route>

        {/* Protected Route - Requires login */}
        <Route path='/dashboard/*' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard/>
          </ProtectedRoute>
        }></Route>

        <Route path='/marketplace/*' element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentMarketPlace />
          </ProtectedRoute>
        }></Route>

      </Routes>
      <Toaster position='bottom-right'/>
    </>
  )
}

export default App
