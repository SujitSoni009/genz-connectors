import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import PersonProfile from './pages/PersonProfile';
import Projects from './pages/Projects';
import ProjectNew from './pages/ProjectNew';
import ProjectDetails from './pages/ProjectDetails';
import Discover from './pages/Discover';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile/setup" element={<ProfileSetup />} />
          <Route path="discover" element={<Discover />} />
          <Route path="people/:id" element={<PersonProfile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectNew />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="events" element={<PlaceholderPage title="Events" />} />
          <Route path="events/:id" element={<PlaceholderPage title="Event Details" />} />
          <Route path="connections" element={<PlaceholderPage title="Connections" />} />
          <Route path="messages" element={<PlaceholderPage title="Messages" />} />
          <Route path="followups" element={<PlaceholderPage title="Follow-ups" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

