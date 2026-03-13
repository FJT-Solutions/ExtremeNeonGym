import React, { useState } from 'react'

const Navbar = ({ scrolled, navItems, activeSection, handleNavClick, user, onAuthClick, onDashboardClick, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMobileClick = (id) => {
        handleNavClick(id);
        setIsMenuOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="nav-container">
                <div className="logo glow-text-pink" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>ExtremeGym</div>
                
                {/* Hamburger Toggle */}
                <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleMobileClick(item.id)}
                            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                    {user ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="neon-btn cyan small" onClick={() => { onDashboardClick(); setIsMenuOpen(false); }}>
                                {user.username}
                            </button>
                            <button className="neon-btn glow-pink small" onClick={() => { onLogout(); setIsMenuOpen(false); }}>
                                Sair
                            </button>
                        </div>
                    ) : (
                        <button
                            className="neon-btn cyan"
                            onClick={() => { onAuthClick(); setIsMenuOpen(false); }}
                        >
                            Entrar
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
