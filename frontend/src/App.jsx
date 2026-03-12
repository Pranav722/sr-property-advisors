import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Property from './pages/Property';
import Dashboard from './pages/Dashboard';
import ProjectsAdmin from './pages/ProjectsAdmin';
import Inventory from './pages/Inventory';
import LocationsAdmin from './pages/LocationsAdmin';
import Leads from './pages/Leads';
import FileManager from './pages/FileManager';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <>
        <div className="min-h-screen bg-slate-50 pb-[80px] md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/property/:id" element={<Property />} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
            <Route path="/projects-admin" element={<ProtectedRoute adminOnly={true}><ProjectsAdmin /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute adminOnly={true}><Inventory /></ProtectedRoute>} />
            <Route path="/locations" element={<ProtectedRoute adminOnly={true}><LocationsAdmin /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute adminOnly={true}><Leads /></ProtectedRoute>} />
            <Route path="/file-manager" element={<ProtectedRoute adminOnly={true}><FileManager /></ProtectedRoute>} />
            {/* We will route all the legacy HTML pages into explicit paths here soon */}
          </Routes>
        </div>
        <BottomNav />
      </>
    </GoogleOAuthProvider>
  );
};

export default App;
