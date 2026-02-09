import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages for Performance Optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const ModelViewer = lazy(() => import('./pages/ModelViewer'));
const DesignEditor = lazy(() => import('./pages/DesignEditor'));
const Advanced3DEditor = lazy(() => import('./pages/Advanced3DEditor'));
const InteriorDesignStudio = lazy(() => import('./pages/InteriorDesignStudio'));
const WholeHouseDesigner = lazy(() => import('./pages/WholeHouseDesigner'));
const TwoDDesignStudio = lazy(() => import('./pages/TwoDDesignStudio'));
const HouseBuilder = lazy(() => import('./pages/HouseBuilder'));
const BookingForm = lazy(() => import('./pages/BookingForm'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const AIConsultant = lazy(() => import('./pages/AIConsultant'));

function AppContent() {
  const location = useLocation();
  const hideNavFooter = location.pathname.startsWith('/model/') ||
    location.pathname.startsWith('/admin/login') ||
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname === '/editor' ||
    location.pathname === '/advanced-editor' ||
    location.pathname === '/interior-studio' ||
    location.pathname === '/2d-studio' ||
    location.pathname === '/house-builder';
  const hideNavbar = hideNavFooter || location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/features" element={<Features />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/model/:id" element={<ModelViewer />} />
            <Route path="/editor" element={<DesignEditor />} />
            <Route path="/advanced-editor" element={<Advanced3DEditor />} />
            <Route path="/interior-studio" element={<InteriorDesignStudio />} />
            <Route path="/2d-studio" element={<TwoDDesignStudio />} />
            <Route path="/ai-consultant" element={<AIConsultant />} />
            <Route path="/house-builder" element={<HouseBuilder />} />
            <Route path="/booking/:id" element={<BookingForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
            />
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App;

