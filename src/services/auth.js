const USERS_KEY = 'extremegym_users';
const SESSION_KEY = 'extremegym_session';

export const authService = {
    // Get all users from "database"
    getUsers: () => {
        const users = localStorage.getItem(USERS_KEY);
        // Default admin user if database is empty or doesn't have it
        const defaultUsers = [{
            username: 'admin',
            password: 'admin123@',
            role: 'admin',
            name: 'System Admin',
            email: 'admin@extremegym.com'
        }];
        const storedUsers = users ? JSON.parse(users) : [];

        if (!storedUsers.find(u => u.username === 'admin')) {
            storedUsers.unshift(defaultUsers[0]);
        }

        return storedUsers;
    },

    // Register a new user
    signup: (userData) => {
        const users = authService.getUsers();

        if (users.find(u => u.username === userData.username || u.email === userData.email)) {
            throw new Error('Usuário ou Email já cadastrado!');
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            role: 'user',
            joinDate: new Date().toISOString(),
            status: 'Ativo',
            paymentStatus: Math.random() > 0.3 ? 'Pago' : 'Pendente' // Simulating payment
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return authService.login(userData.username, userData.password);
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

    // Update user (for admin)
    updateUser: (userId, newData) => {
        const users = authService.getUsers();
        const updatedUsers = users.map(u => u.id === userId ? { ...u, ...newData } : u);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    getCurrentUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }
};

