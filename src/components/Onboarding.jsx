import React, { useState } from 'react'

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: '',
        experience: 'Iniciante',
        availability: '3x',
        equipment: [],
        focus: 'Ganhar massa',
        limitations: ''
    });

    const equipmentOptions = [
        'Halteres', 'Barra', 'Polia', 'Máquinas', 'Smith', 'Leg Press'
    ];

    const handleCheckChange = (item) => {
        const newEquip = formData.equipment.includes(item)
            ? formData.equipment.filter(i => i !== item)
            : [...formData.equipment, item];
        setFormData({ ...formData, equipment: newEquip });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(formData);
    };

    return (
        <div className="onboarding-container fade-in">
            <div className="onboarding-card neon-border-cyan">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>

                {step === 1 && (
                    <div className="onboarding-step">
                        <h2 className="glow-text-cyan">Vamos Começar! 🚀</h2>
                        <p>Conte um pouco sobre você.</p>
                        <div className="input-group">
                            <label>Idade</label>
                            <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="Ex: 25" />
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Peso (kg)</label>
                                <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="70" />
                            </div>
                            <div className="input-group">
                                <label>Altura (cm)</label>
                                <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="175" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Sexo</label>
                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <button className="neon-btn" onClick={nextStep} disabled={!formData.age || !formData.gender}>Próximo</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="onboarding-step">
                        <h2 className="glow-text-cyan">Seu Nível e Rotina ⚡</h2>
                        <div className="input-group">
                            <label>Nível de experiência</label>
                            <select value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}>
                                <option value="Sedentário">Sedentário</option>
                                <option value="Iniciante">Iniciante (&lt; 6 meses)</option>
                                <option value="Intermediário">Intermediário (1-2 anos)</option>
                                <option value="Avançado">Avançado</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Disponibilidade (dias na semana)</label>
                            <select value={formData.availability} onChange={e => setFormData({ ...formData, availability: e.target.value })}>
                                <option value="3x">3x na semana</option>
                                <option value="4x">4x na semana</option>
                                <option value="5x">5x na semana</option>
                                <option value="Todo dia">Todo dia</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Foco / Prioridade</label>
                            <select value={formData.focus} onChange={e => setFormData({ ...formData, focus: e.target.value })}>
                                <option value="Ganhar massa">Ganhar massa</option>
                                <option value="Emagrecer">Emagrecer</option>
                                <option value="Focar em pernas">Focar em pernas</option>
                                <option value="Focar em braços">Focar em braços</option>
                            </select>
                        </div>
                        <div className="btn-row">
                            <button className="neon-btn secondary" onClick={prevStep}>Voltar</button>
                            <button className="neon-btn" onClick={nextStep}>Próximo</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="onboarding-step">
                        <h2 className="glow-text-pink">Equipamentos e Limites 🛠️</h2>
                        <div className="input-group">
                            <label>Equipamentos disponíveis na sua academia:</label>
                            <div className="checkbox-grid">
                                {equipmentOptions.map(item => (
                                    <label key={item} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={formData.equipment.includes(item)}
                                            onChange={() => handleCheckChange(item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Limitações ou Dores? (Opcional)</label>
                            <textarea
                                value={formData.limitations}
                                onChange={e => setFormData({ ...formData, limitations: e.target.value })}
                                placeholder="Ex: Dor no ombro, não posso impacto..."
                            />
                        </div>
                        <div className="btn-row">
                            <button className="neon-btn secondary" onClick={prevStep}>Voltar</button>
                            <button className="neon-btn glow-pink" onClick={handleSubmit}>Gerar Meu Treino!</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
