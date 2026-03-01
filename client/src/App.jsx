import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import ModelViewer from './pages/ModelViewer'
import DesignEditor from './pages/DesignEditor'
import Advanced3DEditor from './pages/Advanced3DEditor'
import InteriorDesignStudio from './pages/InteriorDesignStudio'
import TwoDDesignStudio from './pages/TwoDDesignStudio'
import BookingForm from './pages/BookingForm'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function AppContent() {
  const location = useLocation();
  const hideNavFooter = location.pathname.startsWith('/model/') || 
                        location.pathname.startsWith('/admin/login') ||
                        location.pathname.startsWith('/admin/dashboard') ||
                        location.pathname === '/editor' ||
                        location.pathname === '/advanced-editor' ||
                        location.pathname === '/interior-studio' ||
                        location.pathname === '/2d-studio';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/model/:id" element={<ModelViewer />} />
          <Route path="/editor" element={<DesignEditor />} />
          <Route path="/advanced-editor" element={<Advanced3DEditor />} />
          <Route path="/interior-studio" element={<InteriorDesignStudio />} />
          <Route path="/2d-studio" element={<TwoDDesignStudio />} />
          <Route path="/booking/:id" element={<BookingForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
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

export default App

