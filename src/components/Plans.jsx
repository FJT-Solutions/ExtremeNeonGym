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
                    <li>Sessão Demo AI</li>
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
                    <li>Personal AI 24h</li>
                </ul>
                <button className="neon-btn" onClick={() => onJoin('Synth Pro')}>Assinar</button>
            </div>
            <div className="plan-card neon-border-purple">
                <h3>Cyber Elite</h3>
                <p className="price">R$ 299,90</p>
                <ul>
                    <li>Acesso VIP Ultra</li>
                    <li>Personal Humano + AI</li>
                    <li>Suplementos Mensais</li>
                    <li>Sauna Infrared</li>
                </ul>
                <button className="neon-btn purple" onClick={() => onJoin('Cyber Elite')}>Assinar</button>
            </div>
        </div>
    </section>
)

export default Plans
