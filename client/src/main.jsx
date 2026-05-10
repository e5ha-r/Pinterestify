import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/context';
import { useContext } from 'react';

// Pages
import Login       from './pages/Login';
import Signup      from './pages/Signup';
import Dashboard   from './pages/Dashboard';
import Explore     from './pages/Explore';
import CreateBoard from './pages/CreateBoard';
import CreatePin   from './pages/CreatePin';
import BoardDetail from './pages/BoardDetail';
import Profile     from './pages/Profile';

// Global styles
import './index.css';

function ProtectedRoute({ children }) {
  const { user } = useContext(AppContext);
  if (!user && !localStorage.getItem('token')) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public */}
          <Route path="/"       element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/explore"    element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/create"     element={<ProtectedRoute><CreateBoard /></ProtectedRoute>} />
          <Route path="/create-pin" element={<ProtectedRoute><CreatePin /></ProtectedRoute>} />
          <Route path="/board/:id"  element={<ProtectedRoute><BoardDetail /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
