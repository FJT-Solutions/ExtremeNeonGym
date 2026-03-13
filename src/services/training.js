// extreme-gym/src/services/training.js

// extreme-gym/src/services/training.js

export const trainingService = {
    generateTraining: (userData) => {
        // Simulating AI logic based on user data
        const daysCount = parseInt(userData.availability) || 3;
        const focus = userData.focus || "Geral";
        const limitations = userData.limitations || "";

        // Fetch gym equipment from localStorage
        const equipmentData = localStorage.getItem('extremegym_equipment');
        let allEquipment = [];
        if (equipmentData) {
            allEquipment = JSON.parse(equipmentData).filter(eq => eq.status === 'Ativo');
        }

        // Fallback if no equipment is available (prevent crash)
        if (allEquipment.length === 0) {
            allEquipment = [
                { id: 'fallback', name: 'Agachamento Livre (Peso do Corpo)', target_muscle: 'Pernas', instructions: 'Agache mantendo a coluna reta.', gif_url: 'https://media.giphy.com/media/l41lM8A5pBAH7U5Xy/giphy.gif' }
            ];
        }

        // Group equipment by body part (rudimentary AI logic)
        const grouped = {
            'Peito': [],
            'Costas': [],
            'Pernas': [],
            'Braços': [],
            'Ombros': [],
            'Geral': []
        };

        allEquipment.forEach(eq => {
            const bodyPart = eq.body_part || 'Geral';
            if (grouped[bodyPart]) {
                grouped[bodyPart].push(eq);
            } else {
                grouped['Geral'].push(eq);
            }
        });

        const schedules = [
            { dia: "Segunda-feira", foco: "Peito e Tríceps", parts: ['Peito', 'Braços'] },
            { dia: "Terça-feira", foco: "Costas e Bíceps", parts: ['Costas', 'Braços'] },
            { dia: "Quarta-feira", foco: "Pernas", parts: ['Pernas', 'Geral'] },
            { dia: "Quinta-feira", foco: "Ombros e Core", parts: ['Ombros', 'Geral'] },
            { dia: "Sexta-feira", foco: "Full Body", parts: ['Peito', 'Costas', 'Pernas'] }
        ];

        // Filter and adapt based on limitations
        const adaptedDays = schedules.slice(0, daysCount).map((schedule, dayIdx) => {
            let dayExercises = [];
            
            // Collect exercises for this day's focus
            schedule.parts.forEach(part => {
                if (grouped[part]) {
                    dayExercises = [...dayExercises, ...grouped[part]];
                }
            });

            // If not enough specific exercises, just pull some generic ones
            if (dayExercises.length < 2) {
                dayExercises = [...dayExercises, ...allEquipment].slice(0, 4);
            }

            // Remove duplicates and pick a few (e.g., 3-5 exercises per day)
            const uniqueEx = Array.from(new Set(dayExercises)).slice(0, 5);

            const formatExec = uniqueEx.map((ex, exIdx) => {
                let name = ex.name;
                let instructions = ex.instructions || "Realize o movimento controlado.";

                if (limitations.toLowerCase().includes("ombro") && (name.includes("Supino") || name.includes("Desenvolvimento"))) {
                    name += " (Amplitude Reduzida)";
                    instructions += " AVISO: Respeite a dor no ombro.";
                }

                return {
                    id: `day-${dayIdx}-ex-${exIdx}-${Date.now()}`,
                    nome: name,
                    target_muscle: ex.target_muscle || ex.muscle || "Vários",
                    series: 4,
                    reps: "10-15",
                    descanso: "60s",
                    gif_url: ex.gif_url,
                    instructions: instructions
                };
            });

            return {
                dia: schedule.dia,
                foco: schedule.foco,
                exercicios: formatExec
            };
        });

        return {
            id: `plan-${Date.now()}`,
            semana: adaptedDays
        };
    },

    adjustTraining: (currentTraining, feedback) => {
        // Simulated AI adjustment based on feedback keywords
        console.log("Adjusting training with feedback:", feedback);
        const feedbackLower = feedback.toLowerCase();
        let adjusted = JSON.parse(JSON.stringify(currentTraining));

        // Just blindly filter out things we don't like as requested
        if (feedbackLower.includes("tirar") || feedbackLower.includes("não gosto") || feedbackLower.includes("dor")) {
            adjusted.semana.forEach(day => {
                day.exercicios = day.exercicios.filter(ex => !feedbackLower.includes(ex.nome.toLowerCase()));
            });
        }

        return adjusted;
    }
};

