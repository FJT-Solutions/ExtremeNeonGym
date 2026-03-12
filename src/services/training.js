// extreme-gym/src/services/training.js

// extreme-gym/src/services/training.js

export const trainingService = {
    generateTraining: (userData) => {
        // Simulating AI logic based on user data
        const daysCount = parseInt(userData.availability) || 3;
        const focus = userData.focus || "Geral";
        const equipment = userData.equipment || [];
        const limitations = userData.limitations || "";

        const allPossibleDays = [
            {
                dia: "Segunda-feira",
                foco: focus === "Ganhar massa" ? "Peito e Tríceps" : focus === "Focar em pernas" ? "Quadríceps" : "Superior (Push)",
                exercicios: [
                    { nome: "Supino Reto", series: 4, reps: "10-12", descanso: "90s", slug_gif: "bench-press", instrucao_curta: "Mantenha as escápulas retraídas e planta dos pés no chão." },
                    { nome: "Desenvolvimento Halteres", series: 3, reps: "12", descanso: "60s", slug_gif: "shoulder-press", instrucao_curta: "Não desça além da linha das orelhas." },
                    { nome: "Tríceps Testa", series: 3, reps: "15", descanso: "45s", slug_gif: "skull-crusher", instrucao_curta: "Mantenha os cotovelos apontando para o teto." }
                ]
            },
            {
                dia: "Terça-feira",
                foco: focus === "Focar em pernas" ? "Posterior e Glúteo" : "Costas e Bíceps",
                exercicios: [
                    { nome: "Puxada Frontal", series: 4, reps: "12", descanso: "60s", slug_gif: "lat-pulldown", instrucao_curta: "Puxe a barra em direção ao peito, não ao pescoço." },
                    { nome: "Remada Curvada", series: 3, reps: "10", descanso: "90s", slug_gif: "bent-over-row", instrucao_curta: "Mantenha a coluna neutra e core ativado." },
                    { nome: "Rosca Martelo", series: 3, reps: "12", descanso: "45s", slug_gif: "hammer-curl", instrucao_curta: "Suba o halter sem balançar o corpo." }
                ]
            },
            {
                dia: "Quarta-feira",
                foco: "Membros Inferiores",
                exercicios: [
                    { nome: "Agachamento Livre", series: 4, reps: "8-10", descanso: "120s", slug_gif: "squat", instrucao_curta: "Peso nos calcanhares e joelhos para fora." },
                    { nome: "Leg Press 45", series: 3, reps: "12", descanso: "90s", slug_gif: "leg-press", instrucao_curta: "Não estenda totalmente os joelhos no topo." },
                    { nome: "Cadeira Extensora", series: 3, reps: "15", descanso: "45s", slug_gif: "leg-extension", instrucao_curta: "Contraia bem o quadríceps no topo." }
                ]
            },
            {
                dia: "Quinta-feira",
                foco: "Ombros e Core",
                exercicios: [
                    { nome: "Elevação Lateral", series: 4, reps: "15", descanso: "45s", slug_gif: "lateral-raise", instrucao_curta: "Pense em empurrar o peso para os lados, não para cima." },
                    { nome: "Encolhimento Halteres", series: 3, reps: "12", descanso: "60s", slug_gif: "shrugs", instrucao_curta: "Movimento vertical, sem girar os ombros." },
                    { nome: "Prancha Abdominal", series: 3, reps: "45s", descanso: "45s", slug_gif: "plank", instrucao_curta: "Mantenha o corpo em linha reta e abdômen contraído." }
                ]
            },
            {
                dia: "Sexta-feira",
                foco: "Full Body / Cardio HIIT",
                exercicios: [
                    { nome: "Burpees", series: 3, reps: "10", descanso: "60s", slug_gif: "burpees", instrucao_curta: "Salte com explosão e mantenha o ritmo." },
                    { nome: "Kettlebell Swing", series: 3, reps: "20", descanso: "60s", slug_gif: "kettlebell-swing", instrucao_curta: "O movimento vem do quadril, não dos braços." },
                    { nome: "Mountain Climbers", series: 3, reps: "30s", descanso: "30s", slug_gif: "mountain-climbers", instrucao_curta: "Mantenha a postura de prancha estável." }
                ]
            }
        ];

        // Filter and adapt based on limitations
        const adaptedDays = allPossibleDays.slice(0, daysCount).map((day, dayIdx) => {
            if (limitations.toLowerCase().includes("ombro")) {
                day.exercicios = day.exercicios.map(ex => {
                    if (ex.nome.includes("Supino") || ex.nome.includes("Desenvolvimento")) {
                        return { ...ex, nome: ex.nome + " (Amplitude Reduzida)", instrucao_curta: ex.instrucao_curta + " AVISO: Respeite a dor no ombro." };
                    }
                    return ex;
                });
            }

            // Add unique IDs for each exercise based on day and index
            day.exercicios = day.exercicios.map((ex, exIdx) => ({
                ...ex,
                id: `day-${dayIdx}-ex-${exIdx}-${ex.slug_gif}`
            }));

            return day;
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

        if (feedbackLower.includes("mais") && feedbackLower.includes("braço")) {
            adjusted.semana.forEach(day => {
                if (day.foco.includes("Superior") || day.foco.includes("Bíceps")) {
                    day.exercicios.push({ nome: "Rosca Concentrada", series: 3, reps: "12", descanso: "45s", slug_gif: "concentration-curl", instrucao_curta: "Foque na contração de pico do bíceps." });
                }
            });
        }

        if (feedbackLower.includes("tirar") || feedbackLower.includes("não gosto") || feedbackLower.includes("dor")) {
            adjusted.semana.forEach(day => {
                day.exercicios = day.exercicios.filter(ex => !feedbackLower.includes(ex.nome.toLowerCase()));
            });
        }

        return adjusted;
    }
};

