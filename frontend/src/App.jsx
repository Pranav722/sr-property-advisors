import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import Property from './pages/Property';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import ProjectsAdmin from './pages/ProjectsAdmin';
import LocationsAdmin from './pages/LocationsAdmin';
import UsersAdmin from './pages/UsersAdmin';
import Inventory from './pages/Inventory';
import Leads from './pages/Leads';
import FileManager from './pages/FileManager';
import SettingsAdmin from './pages/SettingsAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/property/slug/:slug" element={<Property />} />
            <Route path="/property/:id" element={<Property />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
            <Route path="/projects-admin" element={<ProtectedRoute adminOnly><ProjectsAdmin /></ProtectedRoute>} />
            <Route path="/locations" element={<ProtectedRoute adminOnly><LocationsAdmin /></ProtectedRoute>} />
            <Route path="/users-admin" element={<ProtectedRoute adminOnly><UsersAdmin /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute adminOnly><Inventory /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute adminOnly={true}><Leads /></ProtectedRoute>} />
            <Route path="/file-manager" element={<ProtectedRoute adminOnly={true}><FileManager /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute adminOnly={true}><SettingsAdmin /></ProtectedRoute>} />
            {/* We will route all the legacy HTML pages into explicit paths here soon */}
          </Routes>
        </div>
        <BottomNav />
      </>
    </GoogleOAuthProvider>
  );
};

export default App;
