import React, { useState } from 'react'

const Onboarding = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        nome_completo: '',
        idade: '',
        peso: '',
        altura: '',
        objetivo: 'Hipertrofia',
        nivel: 'Iniciante',
        equipamentos: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(formData);
    };

    return (
        <div className="onboarding-container fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
            <div className="onboarding-card neon-border-cyan" style={{ width: '100%', maxWidth: '600px', background: 'rgba(20, 20, 30, 0.95)', padding: '2.5rem', borderRadius: '15px' }}>
                <h2 className="glow-text-cyan" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Primeiro Acesso 🚀</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#ccc' }}>Precisamos de algumas informações (apenas desta vez) para que nossa IA gere o melhor treino para você.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="small-detail glow-text-cyan">Nome Completo</label>
                        <input className="neon-input full-width" placeholder="Ex: João da Silva" value={formData.nome_completo} onChange={e => setFormData({ ...formData, nome_completo: e.target.value })} required />
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="input-group">
                            <label className="small-detail glow-text-cyan">Idade</label>
                            <input className="neon-input full-width" type="number" placeholder="Ex: 25" value={formData.idade} onChange={e => setFormData({ ...formData, idade: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label className="small-detail glow-text-cyan">Peso (kg)</label>
                            <input className="neon-input full-width" type="number" placeholder="Ex: 75" value={formData.peso} onChange={e => setFormData({ ...formData, peso: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label className="small-detail glow-text-cyan">Altura (cm)</label>
                            <input className="neon-input full-width" type="number" placeholder="Ex: 175" value={formData.altura} onChange={e => setFormData({ ...formData, altura: e.target.value })} required />
                        </div>
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="input-group">
                            <label className="small-detail glow-text-cyan">Objetivo</label>
                            <select className="neon-input full-width" value={formData.objetivo} onChange={e => setFormData({ ...formData, objetivo: e.target.value })} required>
                                <option value="Hipertrofia">Hipertrofia</option>
                                <option value="Emagrecimento">Emagrecimento</option>
                                <option value="Definição">Definição</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="small-detail glow-text-cyan">Nível</label>
                            <select className="neon-input full-width" value={formData.nivel} onChange={e => setFormData({ ...formData, nivel: e.target.value })} required>
                                <option value="Iniciante">Iniciante</option>
                                <option value="Intermediário">Intermediário</option>
                                <option value="Avançado">Avançado</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label className="small-detail glow-text-cyan">Equipamentos Disponíveis</label>
                        <p style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '8px'}}>Descreva o que você tem acesso (texto livre).</p>
                        <textarea 
                            className="neon-input full-width" 
                            placeholder="Ex: Tenho 2 halteres de 10kg, uma barra fixa e um elástico..." 
                            rows="3"
                            value={formData.equipamentos} 
                            onChange={e => setFormData({ ...formData, equipamentos: e.target.value })} 
                            required 
                        />
                    </div>

                    <button type="submit" className="neon-btn glow-pink full-width" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        SALVAR E GERAR MEU TREINO
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
