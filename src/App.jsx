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
import Testimonials from './components/Testimonials'
import Plans from './components/Plans'
import Contact from './components/Contact'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser()
    if (currentUser) setUser(currentUser)

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'about', label: 'Quem Somos' },
    { id: 'services', label: 'Serviços' },
    { id: 'units', label: 'Unidades' },
    { id: 'social', label: 'Social' },
    { id: 'plans', label: 'Planos' },
    { id: 'contact', label: 'Contato' },
  ]

  const handleNavClick = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
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
      setActiveSection('dashboard')
    }
  }

  return (
    <div className="app-wrapper">
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
        onDashboardClick={() => setActiveSection('dashboard')}
      />

      {activeSection === 'dashboard' && user ? (
        <Dashboard user={user} onLogout={handleLogout} onBack={() => setActiveSection('home')} />
      ) : (
        <main>
          <Hero onStart={() => handleJoinClick('Basic')} />
          <About />
          <Services />
          <Units />
          <Gallery />
          <SocialFeed />
          <Testimonials />
          <Plans onJoin={handleJoinClick} />
          <Contact />
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
