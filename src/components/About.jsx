import React from 'react'

const About = () => (
    <section id="about" className="section about-section">
        <div className="about-header">
            <h2 className="glow-text-cyan">A Nova Era Fitness</h2>
            <p className="about-subtitle">Combinamos a nostalgia dos anos 80 com a tecnologia de 2026.</p>
        </div>
        
        <div className="about-grid">
            <div className="about-card intro-card neon-border-purple bento-1">
                <h3>Nossa Essência</h3>
                <p>A Extremegym não é apenas uma academia, é uma experiência sensorial futurista. Nascida da paixão pela estética synthwave e pela alta performance, transformamos o suor em arte digital.</p>
                <div className="about-tags">
                    <span>#Cyberpunk</span>
                    <span>#Vaporwave</span>
                    <span>#Hardcore</span>
                </div>
            </div>

            <div className="about-card pill-card neon-border-cyan bento-2">
                <div className="pillar-icon">🦾</div>
                <h4>Alta Performance</h4>
                <p>Treinos otimizados por IA para resultados brutais.</p>
            </div>

            <div className="about-card pill-card neon-border-pink bento-3">
                <div className="pillar-icon">🌌</div>
                <h4>Estética Imersiva</h4>
                <p>Luzes neon e trilha sonora que te elevam ao limite.</p>
            </div>

            <div className="about-card image-card bento-4">
                <img src="/class_functional_neon.png" alt="Gym" className="about-img" />
                <div className="img-overlay">
                    <span className="overlay-text">LEVEL UP YOUR GAME</span>
                </div>
            </div>
        </div>
    </section>
)

export default About
