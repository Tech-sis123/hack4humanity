import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/authService';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Browse from './pages/Browse';
import Matches from './pages/Matches';
import ConnectionDetail from './pages/ConnectionDetail';
import Messages from './pages/Messages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            {/* Landing page */}
            <Route 
              path="/" 
              element={
                isAuthenticated() ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Landing />
              } 
            />
            
            {/* Public routes - redirect to dashboard if authenticated */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Browse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/connections" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Matches />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/connections/:connectionId" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <ConnectionDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Messages route */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            
            {/* Settings route */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <div className="coming-soon">
                    <h2>Settings</h2>
                    <p>Account settings coming soon!</p>
                    <button onClick={() => window.location.href = '/profile'} className="browse-redirect-button">
                      Edit Profile Instead
                    </button>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to appropriate page */}
            <Route 
              path="*" 
              element={
                isAuthenticated() ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/" replace />
              } 
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;