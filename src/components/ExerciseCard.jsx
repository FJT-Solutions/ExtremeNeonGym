import React, { useState } from 'react'

const ExerciseCard = ({ exercise, completed, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`exercise-card ${completed ? 'completed' : ''} neon-border-blue`}>
            <div className="exercise-main">
                <div className="exercise-info">
                    <h4>{exercise.nome}</h4>
                    <div className="exercise-meta">
                        <span className="meta-badge">{exercise.series} Séries</span>
                        <span className="meta-badge">{exercise.reps} Reps</span>
                        <span className="meta-badge rest">⏳ {exercise.descanso}</span>
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
                                src={`/gifs/${exercise.slug_gif}.gif`}
                                alt={exercise.nome}
                                className="exercise-gif"
                                onError={(e) => {
                                    // Fallback to Giphy search for the slug if local fails
                                    const giphys = {
                                        'bench-press': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif',
                                        'squat': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif', // Replace with real search or map
                                    };
                                    e.target.src = giphys[exercise.slug_gif] || 'https://media.giphy.com/media/l41lM8A5pBAH7U5Xy/giphy.gif';
                                }}
                            />
                            <div className="gif-placeholder">
                                <div className="mock-gif">
                                    <span className="glow-text-cyan">{exercise.nome}</span>
                                    <p className="small-detail">Visualização Retrowave</p>
                                </div>
                            </div>
                        </div>
                        <div className="instructions">
                            <h5>Como fazer:</h5>
                            <p>{exercise.instrucao_curta || 'Siga o movimento controlado, mantendo a postura ereta e foco no músculo alvo.'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseCard;
