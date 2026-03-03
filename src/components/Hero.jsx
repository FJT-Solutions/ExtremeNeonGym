import React from 'react'

const Hero = ({ onStart }) => (
    <section id="home" className="hero-section">
        <div className="hero-content">
            <h1 className="main-title glow-text-pink">ExtremeGym</h1>
            <p className="hero-subtitle">Treine no futuro. Estética 80s, Performance 2026.</p>
            <div className="hero-btns">
                <button className="neon-btn" onClick={onStart}>Começar Agora</button>
                <button className="neon-btn cyan" onClick={() => document.getElementById('units').scrollIntoView({ behavior: 'smooth' })}>Ver Unidades</button>
            </div>
        </div>
    </section>
)

export default Hero
