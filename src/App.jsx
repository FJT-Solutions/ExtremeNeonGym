import { useState, useEffect } from 'react'
import { authService } from './services/auth'
import './App.css'

// Import Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Units from './components/Units'
import Gallery from './components/Gallery'
import SocialFeed from './components/SocialFeed'
import ClassCarousel from './components/ClassCarousel'
import Plans from './components/Plans'
import Contact from './components/Contact'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import PlanCheckout from './components/PlanCheckout'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const adminRoles = ['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'];
      if (adminRoles.includes(currentUser.role)) setActiveSection('admin')
    }

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)

    // Scroll Spy Logic
    const sectionRatios = {};
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            sectionRatios[entry.target.id] = entry.intersectionRatio;
        });

        let maxRatio = 0;
        let activeCandidate = '';

        for (const id in sectionRatios) {
            if (sectionRatios[id] > maxRatio) {
                maxRatio = sectionRatios[id];
                activeCandidate = id;
            }
        }

        if (maxRatio > 0.1) {
            setActiveSection(activeCandidate);
        }
    }, {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: '-15% 0px -25% 0px'
    });
    
    const currentSections = ['home', 'about', 'services', 'classes', 'units', 'social', 'plans'];
    currentSections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [])

  const navItems = [
    { id: 'about', label: 'Quem Somos' },
    { id: 'services', label: 'Serviços' },
    { id: 'classes', label: 'Aulas' },
    { id: 'units', label: 'Unidades' },
    { id: 'social', label: 'Social' },
    { id: 'plans', label: 'Planos' },
  ]

  const handleNavClick = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    const adminRoles = ['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'];
    if (adminRoles.includes(userData.role)) {
      setActiveSection('admin')
    } else {
      setActiveSection('dashboard')
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setActiveSection('home')
  }

  const handleJoinClick = (planName) => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      setActiveSection(user.role === 'admin' ? 'admin' : 'dashboard')
    }
  }

  // Scroll snap should only be active on the main landing page
  const noSnapVews = ['dashboard', 'admin'];
  const wrapperClass = `app-wrapper ${noSnapVews.includes(activeSection) ? 'no-snap' : ''}`;

  const adminRoles = ['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'];
  const isStaff = user && adminRoles.includes(user.role);

  if (activeSection === 'checkout' && selectedPlan) {
    return <PlanCheckout plan={selectedPlan} onBack={() => setActiveSection(user ? 'dashboard' : 'home')} />;
  }

  if (activeSection === 'admin' && isStaff) {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  return (
    <div className={wrapperClass}>
      <div className="synth-bg">
        <div className="grid"></div>
      </div>
      <div className="scanlines"></div>

      <Navbar
        scrolled={scrolled}
        navItems={navItems}
        activeSection={activeSection}
        handleNavClick={handleNavClick}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onDashboardClick={() => {
          const adminRoles = ['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'];
          setActiveSection(user && adminRoles.includes(user.role) ? 'admin' : 'dashboard')
        }}
        onLogout={handleLogout}
      />

      {activeSection === 'dashboard' && user ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onBack={() => setActiveSection('home')}
          onCheckout={(plan) => { setSelectedPlan(plan); setActiveSection('checkout'); }}
        />
      ) : (
        <main>
          <Hero onStart={() => handleJoinClick('Basic')} />
          <About />
          <Services />
          <ClassCarousel />
          <Units />
          <Gallery />
          <SocialFeed />
          <Plans onJoin={handleJoinClick} />
        </main>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <Footer />
    </div>
  )
}

export default App

