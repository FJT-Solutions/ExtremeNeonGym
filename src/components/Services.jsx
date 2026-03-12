import React from 'react'

const Services = () => {
    const services = [
        { title: 'Musculação', desc: 'Equipamentos de última geração com iluminação imersiva.', icon: '🏋️‍♂️' },
        { title: 'Crossfit', desc: 'Desafie seus limites em nossa arena neon.', icon: '🔥' },
        { title: 'Personal AI', desc: 'Suporte inteligente para seu desenvolvimento.', icon: '🤖' },
        { title: 'Coletivas', desc: 'Aulas de dança e luta com trilha synthwave.', icon: '🕺' },
        { title: 'Yoga Neon', desc: 'Equilíbrio mental e físico sob luz ultra-violeta.', icon: '🧘‍♀️' },
        { title: 'Nutrição', desc: 'Planos alimentares otimizados para seu biotipo.', icon: '🥗' },
    ]
    return (
        <section id="services" className="section section-services">
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
