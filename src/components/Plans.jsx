import React from 'react'

const Plans = ({ onJoin }) => (
    <section id="plans" className="section">
        <h2 className="glow-text-pink">Planos Digitais</h2>
        <div className="plans-grid">
            <div className="plan-card neon-border-cyan">
                <h3>Basic Node</h3>
                <p className="price">R$ 89,90</p>
                <ul>
                    <li>Acesso Musculação</li>
                    <li>App de Treino</li>
                </ul>
                <button className="neon-btn cyan" onClick={() => onJoin('Basic Node')}>Assinar</button>
            </div>
            <div className="plan-card featured neon-border-pink">
                <div className="badge">Popular</div>
                <h3>Synth Pro</h3>
                <p className="price">R$ 149,90</p>
                <ul>
                    <li>Acesso Total</li>
                    <li>Aulas Coletivas</li>
                    <li>Bioimpedância</li>
                </ul>
                <button className="neon-btn" onClick={() => onJoin('Synth Pro')}>Assinar</button>
            </div>
        </div>
    </section>
)

export default Plans
