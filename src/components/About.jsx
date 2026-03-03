import React from 'react'

const About = () => (
    <section id="about" className="section glass-section">
        <h2 className="glow-text-cyan">Quem Somos</h2>
        <div className="section-content">
            <div className="about-text">
                <p>A Extremegym não é apenas uma academia, é uma experiência sensorial futurista. Nascida da paixão pela estética synthwave e pela alta performance, oferecemos o ambiente perfeito para quem busca resultados reais com um estilo inigualável.</p>
                <p>Nossa equipe é composta por ciborgues... quer dizer, profissionais altamente qualificados prontos para te levar ao limite.</p>
            </div>
            <div className="about-img-container">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" alt="Gym" className="neon-img" />
            </div>
        </div>
    </section>
)

export default About
