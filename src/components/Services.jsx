import React from 'react'

const Services = () => {
    const services = [
        { title: 'Musculação', desc: 'Equipamentos de última geração com iluminação imersiva.', icon: '🏋️‍♂️' },
        { title: 'Crossfit', desc: 'Desafie seus limites em nossa arena neon.', icon: '🔥' },
        { title: 'Personal', desc: 'Atenção exclusiva para seu desenvolvimento.', icon: '🤖' },
        { title: 'Coletivas', desc: 'Aulas de dança e luta com trilha synthwave.', icon: '🕺' },
    ]
    return (
        <section id="services" className="section">
            <h2 className="glow-text-pink">Nossos Serviços</h2>
            <div className="service-grid">
                {services.map((s, i) => (
                    <div key={i} className="service-card neon-border-cyan">
                        <div className="service-icon">{s.icon}</div>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Services
