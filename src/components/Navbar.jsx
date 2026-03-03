import React from 'react'

const Navbar = ({ scrolled, navItems, activeSection, handleNavClick, user, onAuthClick, onDashboardClick }) => {
    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="logo glow-text-pink" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>ExtremeGym</div>
                <div className="nav-links">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                    {user ? (
                        <button className="neon-btn cyan small" onClick={onDashboardClick}>
                            {user.username}
                        </button>
                    ) : (
                        <button
                            className="neon-btn cyan"
                            onClick={onAuthClick}
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
