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
        if (!isPremium) {
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
            setViewState('upsell');
            return;
        }

        console.log(`[LOG] IA gerou treino: user_id=${userData.id}, timestamp=${new Date().toISOString()}`);

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
        if (!isPremium) {
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
            <div className="fade-in" style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <span className="glow-text-pink" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Acesso Restrito</span>
                    <h1 className="glow-text-cyan" style={{ fontSize: '3rem', margin: '1rem 0' }}>Desbloqueie seu Potencial Máximo</h1>
                    <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
                        Eleve seus treinos a um novo patamar com nossa Inteligência Artificial exclusiva. Assine hoje para gerar treinos dinâmicos, ajustados conforme sua rotina, biomecânica e evolução diária.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem', alignItems: 'center' }}>
                    {/* Basic Tier */}
                    <div className="glass-panel hover-glow" style={{ padding: '3rem 2rem', border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '15px', background: 'rgba(10, 15, 25, 0.8)' }}>
                        <h2 className="glow-text-cyan" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Plano BASIC</h2>
                        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Perfeito para quem quer começar a treinar com inteligência.</p>
                        <div style={{ marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>R$ 29</span><span style={{ color: '#888' }}>/mês</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 0 2rem 0', lineHeight: '2.5' }}>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>✔️ <strong style={{ color: '#fff' }}>Treinos de IA</strong> Ilimitados</li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>✔️ Ajustes <strong>dinâmicos</strong> com a IA</li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>✔️ Suporte via App (48h)</li>
                            <li style={{ color: '#555' }}>❌ Análise e Correção Biomecânica</li>
                            <li style={{ color: '#555' }}>❌ Dieta e Plano Alimentar (IA)</li>
                        </ul>
                        <button className="neon-btn full-width" style={{ padding: '1rem', fontSize: '1rem' }} onClick={() => alert('Redirecionando para portal de pagamento (Stripe)...')}>Assinar Basic</button>
                    </div>

                    {/* Pro Tier (Highlighted) */}
                    <div className="glass-panel hover-glow" style={{ padding: '3.5rem 2rem', border: '2px solid var(--neon-pink)', borderRadius: '15px', transform: 'scale(1.05)', background: 'linear-gradient(180deg, rgba(30,15,30,0.9) 0%, rgba(15,10,20,0.9) 100%)', boxShadow: '0 0 30px rgba(255, 0, 255, 0.2)' }}>
                        <div style={{ background: 'var(--neon-pink)', color: '#000', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem', textTransform: 'uppercase' }}>Mais Escolhido</div>
                        <h2 className="glow-text-pink" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Plano PRO</h2>
                        <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.9rem' }}>A experiência completa da melhor academia tecnológica do mercado.</p>
                        <div style={{ marginBottom: '2rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--neon-pink)' }}>R$ 59</span><span style={{ color: '#aaa' }}>/mês</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 0 2rem 0', lineHeight: '2.5' }}>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>🚀 Tudo do <strong style={{color: 'var(--neon-cyan)'}}>Plano Basic</strong></li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>🔥 Treinos Focados de **Alto Rendimento**</li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>🧠 <strong>Plano Alimentar IA</strong> (Refeições/Macros)</li>
                            <li style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>📹 Análise de postura e alinhamento</li>
                            <li>⚡ Suporte VIP Imediato (Personal)</li>
                        </ul>
                        <button className="neon-btn glow-pink full-width" style={{ padding: '1rem', fontSize: '1rem', fontWeight: 'bold' }} onClick={() => alert('Redirecionando para portal de pagamento Seguro (Stripe)...')}>ASSINAR PRO AGORA</button>
                    </div>
                </div>

                <div className="btn-row" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <button className="nav-link" onClick={() => setViewState(training ? 'training' : 'home')}>Voltar ao Início</button>
                    <button className="nav-link" style={{ marginLeft: '2rem' }}>Entrar em Contato com Vendas</button>
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
                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '8px', background: 'rgba(10, 15, 25, 0.9)' }}>
                                <p style={{ fontSize: '1rem', color: '#fff', marginBottom: '8px' }}>🤖 <strong>Inteligência Artificial de Treinos</strong></p>
                                <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5' }}>Gere rotinas de treino dinâmicas, perfeitamente adaptadas ao seu corpo e biomecânica, sem se limitar a tabelas impressas antigas.</p>
                                <button className="neon-btn secondary small full-width" style={{ marginTop: '1rem' }} onClick={() => setViewState('upsell')}>Ver Benefícios do Plano PRO</button>
                            </div>
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

