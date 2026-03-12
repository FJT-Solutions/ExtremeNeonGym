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

    useEffect(() => {
        if (userData.onboardingData) {
            // Give it a small delay for UX feel (generating...)
            const timer = setTimeout(() => {
                const plan = trainingService.generateTraining(userData.onboardingData);
                setTraining(plan);

                // Load progress for this specific plan
                const savedProgress = localStorage.getItem(`progress_${userData.username}`);
                if (savedProgress) {
                    const progressData = JSON.parse(savedProgress);
                    setCompletedExercises(progressData.completed || []);
                    setXp(progressData.xp || 0);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [userData]);

    const toggleExercise = (exerciseId) => {
        const isCompleting = !completedExercises.includes(exerciseId);
        const newCompleted = isCompleting
            ? [...completedExercises, exerciseId]
            : completedExercises.filter(id => id !== exerciseId);

        const xpGain = 15;
        const newXp = isCompleting ? xp + xpGain : Math.max(0, xp - xpGain);

        setCompletedExercises(newCompleted);
        setXp(newXp);

        // Save to localStorage
        localStorage.setItem(`progress_${userData.username}`, JSON.stringify({
            planId: training?.id,
            completed: newCompleted,
            xp: newXp,
            lastUpdate: new Date().toISOString()
        }));
    };

    const calculateLevel = (currentXp) => {
        return Math.floor(currentXp / 100) + 1;
    };

    const level = calculateLevel(xp);
    const xpProgressInLevel = xp % 100;

    const handleOnboardingComplete = (data) => {
        const updatedUser = { ...userData, onboardingData: data };
        setUserData(updatedUser);

        // Update mock database
        const users = JSON.parse(localStorage.getItem('extremegym_users') || '[]');
        const updatedUsers = users.map(u => u.username === user.username ? { ...u, onboardingData: data } : u);
        localStorage.setItem('extremegym_users', JSON.stringify(updatedUsers));
        localStorage.setItem('extremegym_session', JSON.stringify(updatedUser));
    };

    const handleAdjustTraining = (e) => {
        e.preventDefault();
        const newTraining = trainingService.adjustTraining(training, feedback);
        setTraining(newTraining);
        setShowAdjustment(false);
        setFeedback('');
        alert("Sua solicitação foi enviada! Nosso IA Fisiologista está ajustando seu plano...");
    };

    if (!userData.onboardingData) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    if (!training) return (
        <section className="dashboard-section section">
            <div className="loading glow-text-cyan">
                <h2>Gerando seu treino ultra-personalizado...</h2>
                <div className="progress-bar" style={{ maxWidth: '400px', margin: '2rem auto' }}>
                    <div className="progress-fill" style={{ width: '100%', animation: 'gradient-move 2s infinite' }}></div>
                </div>
            </div>
        </section>
    );

    const currentDay = training.semana[selectedDayIndex];
    const totalExercises = training.semana.reduce((acc, day) => acc + day.exercicios.length, 0);
    const progressPercent = Math.round((completedExercises.length / totalExercises) * 100);

    return (
        <section className="dashboard-section section fade-in">
            <div className="dash-header">
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <h1 className="glow-text-cyan">Olá, {userData.username}!</h1>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                        <p className="day-highlight">Foco: <span className="glow-text-pink">{currentDay.foco}</span></p>
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

                <button className="nav-link" onClick={onBack}>&larr; Voltar para o Site</button>
            </div>

            {/* Day Selector */}
            <div className="day-selector">
                {training.semana.map((day, index) => (
                    <button
                        key={day.dia}
                        className={`day-btn ${selectedDayIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedDayIndex(index)}
                    >
                        {day.dia.substring(0, 3)}
                    </button>
                ))}
            </div>

            {/* Exercise List */}
            <div className="exercise-list">
                {currentDay.exercicios.map((ex, i) => (
                    <ExerciseCard
                        key={ex.id}
                        exercise={ex}
                        completed={completedExercises.includes(ex.id)}
                        onToggle={() => toggleExercise(ex.id)}
                    />
                ))}
            </div>

            {/* Dashboard Actions */}
            <div className="dash-actions">
                <button className="neon-btn secondary" onClick={() => setShowAdjustment(true)}>
                    Não gostou? Ajustar Treino
                </button>
                <button className="neon-btn glow-pink" onClick={onLogout}>Sair</button>
            </div>

            {/* Adjustment Modal */}
            {showAdjustment && (
                <div className="modal-overlay">
                    <div className="modal-content neon-border-purple fade-in">
                        <button className="modal-close-btn" onClick={() => setShowAdjustment(false)}>&times;</button>
                        <h3 className="glow-text-purple">O que você quer mudar?</h3>
                        <p className="small-detail">Ex: "Quero mais foco em braços" ou "Tire o agachamento pois sinto dor"</p>

                        <form onSubmit={handleAdjustTraining}>
                            <textarea
                                className="neon-input"
                                rows="4"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Descreva as alterações desejadas..."
                                required
                            />
                            <div className="btn-row">
                                <button type="button" className="neon-btn secondary" onClick={() => setShowAdjustment(false)}>Cancelar</button>
                                <button type="submit" className="neon-btn">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Dashboard;

