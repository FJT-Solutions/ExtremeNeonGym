export const exerciseDBService = {
    // Simulated ExerciseDB API call for searching exercises
    searchExercises: async (query) => {
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const q = query.toLowerCase();
        return mockExerciseDatabase.filter(ex => 
            ex.name.toLowerCase().includes(q) || 
            ex.target_muscle.toLowerCase().includes(q) ||
            ex.body_part.toLowerCase().includes(q)
        );
    }
};

const mockExerciseDatabase = [
    {
        exercise_id: "ex_001",
        name: "Supino Reto",
        body_part: "Peito",
        target_muscle: "Peitoral maior",
        equipment_type: "Barbell",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Deite no banco e empurre a barra com os braços."
    },
    {
        exercise_id: "ex_002",
        name: "Supino Inclinado",
        body_part: "Peito",
        target_muscle: "Peitoral maior superior",
        equipment_type: "Barbell",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "1. Deite no banco inclinado\n2. Posicione a barra na altura dos olhos\n3. Segure a barra com as mãos na largura dos ombros\n4. Empurre a barra até estender os braços\n5. Retorne lentamente"
    },
    {
        exercise_id: "ex_003",
        name: "Supino Declinado",
        body_part: "Peito",
        target_muscle: "Peitoral maior inferior",
        equipment_type: "Barbell",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Deite no banco declinado e levante o peso."
    },
    {
        exercise_id: "ex_004",
        name: "Dumbbell Bench Press",
        body_part: "Peito",
        target_muscle: "Peitoral",
        equipment_type: "Halteres",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Com os halteres, empurre-os acima do peito."
    },
    {
        exercise_id: "ex_005",
        name: "Chest Press",
        body_part: "Peito",
        target_muscle: "Peitoral",
        equipment_type: "Máquina",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Empurre a máquina para a frente."
    },
    {
        exercise_id: "ex_006",
        name: "Puxada Frontal",
        body_part: "Costas",
        target_muscle: "Latíssimo do dorso",
        equipment_type: "Cabo",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Puxe a barra em direção ao peito."
    },
    {
        exercise_id: "ex_007",
        name: "Remada Curvada",
        body_part: "Costas",
        target_muscle: "Latíssimo do dorso",
        equipment_type: "Barbell",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Mantenha a coluna neutra e puxe a barra."
    },
    {
        exercise_id: "ex_008",
        name: "Desenvolvimento Halteres",
        body_part: "Ombros",
        target_muscle: "Deltoide",
        equipment_type: "Halteres",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Empurre os halteres para o alto."
    },
    {
        exercise_id: "ex_009",
        name: "Agachamento Livre",
        body_part: "Pernas",
        target_muscle: "Quadríceps e Glúteos",
        equipment_type: "Barbell",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Agache mantendo a coluna alinhada."
    },
    {
        exercise_id: "ex_010",
        name: "Leg Press 45",
        body_part: "Pernas",
        target_muscle: "Quadríceps",
        equipment_type: "Máquina",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Empurre a plataforma na máquina de leg press."
    },
    {
        exercise_id: "ex_011",
        name: "Cadeira Extensora",
        body_part: "Pernas",
        target_muscle: "Quadríceps",
        equipment_type: "Máquina",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Estenda as pernas na máquina extensora."
    },
    {
        exercise_id: "ex_012",
        name: "Tríceps Testa",
        body_part: "Braços",
        target_muscle: "Tríceps",
        equipment_type: "Barbell",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Com as costas apoiadas, desça a barra até perto da testa e estenda."
    },
    {
        exercise_id: "ex_013",
        name: "Rosca Martelo",
        body_part: "Braços",
        target_muscle: "Bíceps",
        equipment_type: "Halteres",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Mantenha a pegada neutra e faça a flexão dos braços."
    },
    {
        exercise_id: "ex_014",
        name: "Elevação Lateral",
        body_part: "Ombros",
        target_muscle: "Deltoide lateral",
        equipment_type: "Halteres",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Eleve os braços lateralmente."
    },
    {
        exercise_id: "ex_015",
        name: "Burpees",
        body_part: "Corpo todo",
        target_muscle: "Múltiplos",
        equipment_type: "Peso do corpo",
        gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif",
        instructions: "Faça uma flexão, pule e agache em sequência."
    }
];
