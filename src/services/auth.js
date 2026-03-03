// ExtremeGym Auth Service - Simulating a Database with LocalStorage

const USERS_KEY = 'extremegym_users';
const SESSION_KEY = 'extremegym_session';

export const authService = {
    // Get all users from "database"
    getUsers: () => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    // Register a new user
    signup: (username, password, plan = 'Basic Node') => {
        const users = authService.getUsers();

        if (users.find(u => u.username === username)) {
            throw new Error('Usuário já existe!');
        }

        const newUser = {
            id: Date.now(),
            username,
            password, // In a real app, never store plain text passwords!
            plan,
            joinDate: new Date().toLocaleDateString(),
            stats: { weight: '80kg', bodyFat: '15%' }
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return authService.login(username, password);
    },

    // Login existing user
    login: (username, password) => {
        const users = authService.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            throw new Error('Usuário ou senha inválidos!');
        }

        // Save session
        const sessionData = { ...user };
        delete sessionData.password;
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return sessionData;
    },

    // Logout
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    // Check current session
    getCurrentUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }
};
