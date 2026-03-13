import React, { useState } from 'react'

const ExerciseCard = ({ exercise, completed, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`exercise-card ${completed ? 'completed' : ''} neon-border-blue`}>
            <div className="exercise-main">
                <div className="exercise-info">
                    <h4>{exercise.nome || exercise.name}</h4>
                    <div className="exercise-meta">
                        <span className="meta-badge">{exercise.target_muscle || 'Músculo Alvo'}</span>
                        <span className="meta-badge">{exercise.series || '3'}x{exercise.reps || '12'}</span>
                        <span className="meta-badge rest">⏳ {exercise.descanso || '60s'}</span>
                    </div>
                </div>
                <div className="exercise-actions">
                    <button
                        className={`done-btn ${completed ? 'active' : ''}`}
                        onClick={onToggle}
                    >
                        {completed ? '✓ Feito' : 'Concluir'}
                    </button>
                    <button className="view-btn" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? '▲ Sair' : '▼ Execução'}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="exercise-details fade-in">
                    <div className="execution-content">
                        <div className="gif-container">
                            <img
                                src={exercise.gif_url || 'https://media.giphy.com/media/l41lM8A5pBAH7U5Xy/giphy.gif'}
                                alt={exercise.nome || exercise.name}
                                className="exercise-gif"
                                onError={(e) => {
                                    e.target.src = 'https://media.giphy.com/media/l41lM8A5pBAH7U5Xy/giphy.gif';
                                }}
                            />
                        </div>
                        <div className="instructions">
                            <h5>Como fazer:</h5>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{exercise.instructions || exercise.instrucao_curta || 'Siga o movimento controlado.'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseCard;
