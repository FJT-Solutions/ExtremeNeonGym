import React from 'react'

const Dashboard = ({ user, onLogout, onBack }) => (
    <section className="dashboard-section section fade-in">
        <div className="dash-header">
            <h1 className="glow-text-cyan">Olá, {user.username}!</h1>
            <button className="nav-link" onClick={onBack}>&larr; Voltar para o Site</button>
        </div>
        <div className="dashboard-grid">
            <div className="dash-card neon-border-pink">
                <h3>Meu Plano</h3>
                <p>Plano {user.plan} - Ativo</p>
                <p className="small-detail">Membro desde: {user.joinDate}</p>
                <button className="neon-btn small">Gerenciar</button>
            </div>
            <div className="dash-card neon-border-pink">
                <h3>Minha Bio</h3>
                <p>Peso: {user.stats.weight} | Gordura: {user.stats.bodyFat}</p>
                <button className="neon-btn small">Nova Avaliação</button>
            </div>
            <div className="dash-card neon-border-pink">
                <h3>Próximo Treino</h3>
                <p>Série B: Dorsais e Bíceps</p>
                <button className="neon-btn small">Iniciar Cronômetro</button>
            </div>
        </div>
        <button className="neon-btn" style={{ marginTop: '2rem' }} onClick={onLogout}>Sair</button>
    </section>
)

export default Dashboard
