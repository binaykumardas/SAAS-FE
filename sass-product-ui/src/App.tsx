import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/profile/Profile';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

/**
 * ── Main Layout ──────────────────────────────────────────
 * Wraps pages that SHOULD have a Header and Footer.
 * <Outlet /> is where the specific page components get injected.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {/* Child routes (like Profile, Dashboard) will render here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/**
 * ── App Component ────────────────────────────────────────
 */
const App = () => {
  return (
    <Routes>
      
      {/* ── Auth Routes (NO Header / Footer) ───────────────── */}
      {/* These render directly without the layout wrapper */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── Main App Routes (WITH Header / Footer) ─────────── */}
      {/* Any route nested inside here gets the Header and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/projects" element={<Projects />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>

      {/* ── Default Redirects ──────────────────────────────── */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default App;