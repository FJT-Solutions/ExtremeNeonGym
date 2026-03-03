import React from 'react'

const Units = () => (
    <section id="units" className="section section-units">
        <h2 className="glow-text-cyan">Unidades 2026</h2>
        <div className="radar-container glass-section">
            <div className="radar-grid">
                <div className="radar-circle"></div>
                <div className="radar-circle small"></div>
                <div className="radar-scanner"></div>
                <div className="radar-pin p1" data-label="Downtown Neon"></div>
                <div className="radar-pin p2" data-label="Cyber District"></div>
                <div className="radar-pin p3" data-label="Synth Valley"></div>
            </div>
            <div className="units-list">
                <div className="unit-item neon-border-cyan">
                    <h3>Downtown Neon</h3>
                    <p>Av. das Cores, 808</p>
                    <span className="status">Online</span>
                </div>
                <div className="unit-item neon-border-pink">
                    <h3>Cyber District</h3>
                    <p>Rua do Cromo, 256</p>
                    <span className="status">Capacidade: 80%</span>
                </div>
                <div className="unit-item neon-border-purple">
                    <h3>Synth Valley</h3>
                    <p>Alameda Synth, 101</p>
                    <span className="status">Nova</span>
                </div>
            </div>
        </div>
    </section>
)

export default Units
