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

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/property/:id" element={<Property />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects-admin" element={<ProjectsAdmin />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/locations" element={<LocationsAdmin />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/file-manager" element={<FileManager />} />
          {/* We will route all the legacy HTML pages into explicit paths here soon */}
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
