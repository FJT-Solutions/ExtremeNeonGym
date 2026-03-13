import React, { useState, useEffect } from 'react'
import Onboarding from './Onboarding'
import ExerciseCard from './ExerciseCard'
import { trainingService } from '../services/training'

const Dashboard = ({ user, onLogout, onBack }) => {
    const [userData, setUserData] = useState(user);
    const [training, setTraining] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [xp, setXp] = useState(0);
    const [showAdjustment, setShowAdjustment] = useState(false);
    const [feedback, setFeedback] = useState('');
    
    // View state: 'home', 'onboarding', 'generating', 'training', 'upsell'
    const [viewState, setViewState] = useState('home');

    // Premium Check Validation
    const isPremium = userData.paymentStatus === 'Pago' || ['superadmin', 'admin', 'instrutor', 'financeiro', 'recepcao'].includes(userData.role);
    const today = new Date().toISOString().split('T')[0];
    const freeUsageKey = `free_usage_${userData.username}_${today}`;
    const [freeUsage, setFreeUsage] = useState(parseInt(localStorage.getItem(freeUsageKey)) || 0);

    useEffect(() => {
        const savedTraining = localStorage.getItem(`saved_training_${userData.username}`);
        if (savedTraining) {
            setTraining(JSON.parse(savedTraining));
            // Show the training dashboard straight away if they have a saved training, or keep on home?
            // The prompt asks to have "Gerar Meu Treino" button, let's keep it in "home" when mounting, or jump to training if they already have an active one.
            setViewState('training');
        }

        const savedProgress = localStorage.getItem(`progress_${userData.username}`);
        if (savedProgress) {
            const p = JSON.parse(savedProgress);
            setCompletedExercises(p.completed || []);
            setXp(p.xp || 0);
        }
    }, [userData]);

    const handleGenerateClick = () => {
        if (!isPremium && freeUsage >= 3) {
            setViewState('upsell');
            return;
        }

        if (!userData.onboardingData) {
            setViewState('onboarding');
        } else {
            generatePlan(userData.onboardingData);
        }
    };

    const handleOnboardingComplete = (data) => {
        const updatedUser = { ...userData, onboardingData: data };
        setUserData(updatedUser);

        // Update local mock database
        const users = JSON.parse(localStorage.getItem('extremegym_users') || '[]');
        const updatedUsers = users.map(u => u.username === user.username ? { ...u, onboardingData: data } : u);
        localStorage.setItem('extremegym_users', JSON.stringify(updatedUsers));
        localStorage.setItem('extremegym_session', JSON.stringify(updatedUser));
        
        generatePlan(data);
    };

    const generatePlan = (data, adjustment = '') => {
        if (!isPremium) {
            const newUsage = freeUsage + 1;
            setFreeUsage(newUsage);
            localStorage.setItem(freeUsageKey, newUsage);
            console.log(`[LOG ANTI-ABUSO] IA gerou treino: user_id=${userData.id}, timestamp=${new Date().toISOString()}`);
        }

        setViewState('generating');
        setTimeout(() => {
            let plan;
            if (adjustment && training) {
                plan = trainingService.adjustTraining(training, adjustment);
            } else {
                // Adapt the single equipment string into array if needed by trainingService, but trainingService uses raw string or array.
                plan = trainingService.generateTraining({ ...data, equipment: [data.equipamentos], limitations: data.equipamentos });
            }
            
            setTraining(plan);
            localStorage.setItem(`saved_training_${userData.username}`, JSON.stringify(plan));
            setShowAdjustment(false);
            setFeedback('');
            setSelectedDayIndex(0);
            setViewState('training');
        }, 1500);
    };

    const handleAdjustTraining = (e) => {
        e.preventDefault();
        if (!isPremium && freeUsage >= 3) {
            setShowAdjustment(false);
            setViewState('upsell');
            return;
        }
        generatePlan(userData.onboardingData, feedback);
    };

    const toggleExercise = (exerciseId) => {
        const isCompleting = !completedExercises.includes(exerciseId);
        const newCompleted = isCompleting
            ? [...completedExercises, exerciseId]
            : completedExercises.filter(id => id !== exerciseId);
        const xpGain = 15;
        const newXp = isCompleting ? xp + xpGain : Math.max(0, xp - xpGain);
        
        setCompletedExercises(newCompleted);
        setXp(newXp);
        
        localStorage.setItem(`progress_${userData.username}`, JSON.stringify({
            planId: training?.id,
            completed: newCompleted,
            xp: newXp,
            lastUpdate: new Date().toISOString()
        }));
    };

    const level = Math.floor(xp / 100) + 1;
    const xpProgressInLevel = xp % 100;

    // --- RENDER VIEWS --- //

    if (viewState === 'onboarding') {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    if (viewState === 'generating') {
        return (
            <section className="dashboard-section section">
                <div className="loading glow-text-cyan">
                    <h2>Nossa IA está gerando seu treino ultra-personalizado...</h2>
                    <div className="progress-bar" style={{ maxWidth: '400px', margin: '2rem auto' }}>
                        <div className="progress-fill" style={{ width: '100%', animation: 'gradient-move 2s infinite' }}></div>
                    </div>
                </div>
            </section>
        );
    }

    if (viewState === 'upsell') {
        return (
            <div className="fade-in" style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="glow-text-pink" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚫 GERADOR DE TREINO PREMIUM</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Assine agora e receba treinos personalizados e limitados pela nossa Inteligência Artificial!</p>
                
                <div className="glass-panel" style={{ background: 'rgba(20,20,30,0.8)', padding: '1.5rem', borderRadius: '15px', marginBottom: '3rem', border: '1px solid var(--neon-purple)', display: 'inline-block', minWidth: '350px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '50px', height: '50px', background: 'var(--neon-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                        <div style={{ textAlign: 'left' }}>
                            <strong style={{ display: 'block', fontSize: '1.1rem' }}>{userData.email || userData.username}</strong>
                            <span style={{ color: 'var(--neon-pink)', fontSize: '0.9rem' }}>💳 Plano Gratuito (expirado)</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="glass-panel hover-glow" style={{ padding: '2rem', border: '1px solid var(--neon-cyan)', borderRadius: '10px' }}>
                        <h2 className="glow-text-cyan">🥉 BASIC - R$29/mês</h2>
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '2rem 0', lineHeight: '2' }}>
                            <li>✅ Treinos IA ilimitados</li>
                            <li>✅ Ajustes personalizados</li>
                            <li>✅ Suporte prioritário</li>
                        </ul>
                    </div>
                    <div className="glass-panel hover-glow" style={{ padding: '2rem', border: '2px solid var(--neon-pink)', borderRadius: '10px', transform: 'scale(1.05)' }}>
                        <h2 className="glow-text-pink">🥈 PRO - R$59/mês</h2>
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '2rem 0', lineHeight: '2' }}>
                            <li>✅ Status Premium</li>
                            <li>✅ + Análise biomecânica</li>
                            <li>✅ + Plano alimentar IA</li>
                        </ul>
                    </div>
                </div>

                <div className="btn-row" style={{ justifyContent: 'center' }}>
                    <button className="neon-btn glow-pink" onClick={() => alert('Redirecionando para checkout...')}>ASSINAR AGORA</button>
                    <button className="neon-btn secondary">CONTATO VENDAS</button>
                    <button className="neon-btn small" style={{ marginLeft: '1rem' }} onClick={() => setViewState(training ? 'training' : 'home')}>Voltar</button>
                </div>
            </div>
        );
    }

    if (viewState === 'home') {
        return (
            <div className="fade-in" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '80vh' }}>
                <h1 className="glow-text-cyan">Painel do Aluno</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#ccc' }}>Bem-vindo, {userData.name || userData.username}. Pronto para superar seus limites?</p>
                
                <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {training ? (
                            <>
                                <button className="neon-btn secondary full-width" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={() => setViewState('training')}>
                                    🏋️ ACESSAR TREINO ATUAL
                                </button>
                                <button className="neon-btn glow-cyan full-width" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={handleGenerateClick}>
                                    ⚡ GERAR NOVO TREINO (IA)
                                </button>
                            </>
                        ) : (
                            <button className="neon-btn glow-cyan full-width" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={handleGenerateClick}>
                                ⚡ GERAR MEU TREINO (IA)
                            </button>
                        )}
                        
                        {!isPremium ? (
                            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#aaa' }}>Você tem <strong style={{color: 'var(--neon-pink)'}}>{Math.max(0, 3 - freeUsage)} treinos</strong> gratuitos restantes hoje.</p>
                        ) : (
                            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>👑 Acesso Premium Ativo (Ilimitado)</p>
                        )}
                    </div>
                </div>
                
                <div style={{ marginTop: '3rem' }}>
                    <button className="nav-link" onClick={onBack}>&larr; Voltar para o Site</button>
                    <button className="nav-link" onClick={onLogout} style={{ marginLeft: '2rem', color: 'var(--neon-pink)' }}>Sair</button>
                </div>
            </div>
        );
    }

    // viewState === 'training'
    if (!training) return null;

    const currentDay = training.semana[selectedDayIndex];
    if (!currentDay) return null; // Safe guard
    const totalExercises = training.semana.reduce((acc, day) => acc + (day.exercicios ? day.exercicios.length : 0), 0);
    const progressPercent = totalExercises > 0 ? Math.round((completedExercises.length / totalExercises) * 100) : 0;

    return (
        <section className="dashboard-section section fade-in">
            <div className="dash-header">
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <h1 className="glow-text-cyan">{userData.username}!</h1>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                        <p className="day-highlight">Foco Diário: <span className="glow-text-pink">{currentDay.foco || 'Geral'}</span></p>
                        <span className="level-badge">Lvl {level}</span>
                    </div>
                </div>

                <div className="xp-container" style={{ margin: '0 2rem', minWidth: '200px' }}>
                    <div className="small-detail" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Status de Performance</span>
                        <span className="glow-text-purple">{xp} XP</span>
                    </div>
                    <div className="progress-bar xp-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }}>
                        <div className="progress-fill xp-fill" style={{ width: `${xpProgressInLevel}%`, background: 'var(--neon-purple)', boxShadow: '0 0 10px var(--neon-purple)' }}></div>
                    </div>
                </div>

                <div className="progress-stats" style={{ margin: '0 2rem', minWidth: '150px' }}>
                    <div className="small-detail" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Treino Semanal</span>
                        <span className="glow-text-cyan">{progressPercent}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                        <div className="progress-fill" style={{ width: `${progressPercent}%`, transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>

                <button className="nav-link" onClick={() => setViewState('home')}>&larr; Painel Principal</button>
            </div>

            {/* Day Selector */}
            <div className="day-selector">
                {training.semana.map((day, index) => (
                    <button
                        key={day.dia || index}
                        className={`day-btn ${selectedDayIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedDayIndex(index)}
                    >
                        {day.dia ? day.dia.substring(0, 3) : `Dia ${index+1}`}
                    </button>
                ))}
            </div>

            {/* Exercise List */}
            <div className="exercise-list">
                {currentDay.exercicios && currentDay.exercicios.map((ex) => (
                    <ExerciseCard
                        key={ex.id}
                        exercise={ex}
                        completed={completedExercises.includes(ex.id)}
                        onToggle={() => toggleExercise(ex.id)}
                    />
                ))}
                {(!currentDay.exercicios || currentDay.exercicios.length === 0) && (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Dia de descanso. Relaxe seus músculos.</p>
                )}
            </div>

            {/* Dashboard Actions */}
            <div className="dash-actions" style={{ justifyContent: 'center', marginTop: '3rem' }}>
                <button className="neon-btn glow-cyan" onClick={() => setShowAdjustment(true)} style={{ padding: '0.8rem 2rem' }}>
                    AJUSTAR TREINO
                </button>
            </div>

            {/* Adjustment Modal */}
            {showAdjustment && (
                <div className="modal-overlay">
                    <div className="modal-content neon-border-purple fade-in" style={{ maxWidth: '500px' }}>
                        <button className="modal-close-btn" onClick={() => setShowAdjustment(false)}>&times;</button>
                        <h3 className="glow-text-purple">Ajuste Rápido (IA)</h3>
                        <p className="small-detail" style={{ marginBottom: '1.5rem' }}>Descreva o que deseja mudar. Ex: "Quero mais foco em braços hoje e tirar agachamento".</p>

                        <form onSubmit={handleAdjustTraining}>
                            <textarea
                                className="neon-input full-width"
                                rows="3"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Descreva aqui..."
                                required
                            />
                            <div className="btn-row full-width" style={{ marginTop: '1.5rem' }}>
                                <button type="button" className="neon-btn secondary small" onClick={() => setShowAdjustment(false)}>Cancelar</button>
                                <button type="submit" className="neon-btn small glow-cyan">Gerar Novo Plano</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Dashboard;

