
const CATALOG_KEY = 'extremegym_class_catalog';

export const classService = {
    getCatalog: () => {
        const data = localStorage.getItem(CATALOG_KEY);
        if (data) return JSON.parse(data);
        
        // Initial default classes
        const defaults = [
            {
                id: 1,
                name: 'STEP, GAP E JUMP',
                category: 'AERÓBICO',
                description: 'Uma combinação explosiva de exercícios cardiovasculares para queimar calorias e fortalecer pernas e glúteos.',
                image_url: '/class_step_neon.png',
                status: 'ativa',
                schedule: 'Segunda e Quarta, 18h',
                instructor: 'Profa. Carla'
            },
            {
                id: 2,
                name: 'FUNCIONAL, RITBOX E STEP',
                category: 'CONDICIONAMENTO',
                description: 'Treino dinâmico focado em movimentos naturais do corpo, ritmo e alta intensidade.',
                image_url: '/class_functional_neon.png',
                status: 'ativa',
                schedule: 'Terça e Quinta, 19h',
                instructor: 'Mestre Brutal'
            },
            {
                id: 3,
                name: 'PILATES E ARTES MARCIAIS',
                category: 'EQUILÍBRIO & FORÇA',
                description: 'O equilíbrio perfeito entre a precisão do Pilates e o vigor das artes marciais para desenvolver corpo e mente.',
                image_url: '/class_pilates_neon.png',
                status: 'ativa',
                schedule: 'Sexta, 20h',
                instructor: 'Profa. Ana'
            }
        ];
        localStorage.setItem(CATALOG_KEY, JSON.stringify(defaults));
        return defaults;
    },
    saveCatalog: (catalog) => {
        localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
    }
};
