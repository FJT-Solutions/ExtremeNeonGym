import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { trainingService } from '../services/training';
import AdminClassManager from './AdminClassManager';

const AdminPanel = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        setUsers(authService.getUsers());
        // Load equipment
        const savedEquip = localStorage.getItem('extremegym_equipment');
        setEquipment(savedEquip ? JSON.parse(savedEquip) : [
            { id: 1, name: 'Supino Reto', number: '3', type: 'Peito', muscle: 'Peitoral Maior', instructions: 'Deite e empurre a barra...', status: 'Ativo' },
            { id: 2, name: 'Leg Press', number: '12', type: 'Pernas', muscle: 'Quadríceps', instructions: 'Empurre a plataforma...', status: 'Manutenção' }
        ]);
        // Load tickets
        const savedTickets = localStorage.getItem('extremegym_tickets');
        setTickets(savedTickets ? JSON.parse(savedTickets) : [
            { id: 1, user: 'gabrielaron', subject: 'Problema no Onboarding', message: 'Não consigo prosseguir...', status: 'Aberto', date: '2026-03-10' }
        ]);
        // Load lessons (Aulas) - Expanded sample data
        const savedLessons = localStorage.getItem('extremegym_lessons');
        setLessons(savedLessons ? JSON.parse(savedLessons) : [
            { id: 1, title: 'Muay Thai', instructor: 'Mestre Brutal', instructor_id: 5, room: 'Sala 1', day: 'Segunda', time: '18:00' },
            { id: 2, title: 'Yoga Flow', instructor: 'Profa. Ana', instructor_id: 102, room: 'Sala Zen', day: 'Terça', time: '09:00' },
            { id: 3, title: 'Crossfit High', instructor: 'Mestre Brutal', instructor_id: 5, room: 'Box 1', day: 'Quarta', time: '19:00' },
            { id: 4, title: 'Spinning Neon', instructor: 'Profa. Carla', instructor_id: 202, room: 'Sala Bike', day: 'Segunda', time: '08:00' },
            { id: 5, title: 'Jiu Jitsu', instructor: 'Mestre Brutal', instructor_id: 5, room: 'Tatame', day: 'Quinta', time: '20:00' },
            { id: 6, title: 'Pilates Sky', instructor: 'Profa. Ana', instructor_id: 102, room: 'Sala Zen', day: 'Sexta', time: '10:00' },
        ]);
    }, []);

    // Helper: Check if user has required role (or is superadmin)
    const hasRole = (roles) => {
        if (user.role === 'superadmin') return true;
        return roles.includes(user.role);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <AdminDashboard stats={{ users, equipment, tickets }} />;
            case 'alunos': return <AdminStudents users={users} setUsers={setUsers} currentUser={user} />;
            case 'equipamentos': return <AdminEquipment equipment={equipment} setEquipment={setEquipment} />;
            case 'suporte': return <AdminSupport tickets={tickets} setTickets={setTickets} />;
            case 'aulas': return <AdminLessons lessons={lessons} setLessons={setLessons} currentUser={user} />;
            case 'catalogo': return <AdminClassManager />;
            case 'usuarios': return <AdminUserManagement users={users} setUsers={setUsers} currentUser={user} />;
            default: return <AdminDashboard />;
        }
    };

    return (
        <div className="admin-container fade-in">
            <aside className="admin-sidebar">
                <div className="admin-logo">Admin <span className="glow-text-cyan">Extreme</span></div>
                <div className="user-profile-brief">
                    <p className="small-detail">{user.name}</p>
                    <span className="role-tag">{user.role.toUpperCase()}</span>
                </div>
                <nav className="admin-nav">
                    <div className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</div>
                    
                    {/* Universais */}
                    <div className={`admin-nav-item ${activeTab === 'alunos' ? 'active' : ''}`} onClick={() => setActiveTab('alunos')}>👥 Alunos</div>
                    <div className={`admin-nav-item ${activeTab === 'equipamentos' ? 'active' : ''}`} onClick={() => setActiveTab('equipamentos')}>🏋️ Equipamentos</div>
                    <div className={`admin-nav-item ${activeTab === 'suporte' ? 'active' : ''}`} onClick={() => setActiveTab('suporte')}>📩 Suporte</div>
                    
                    {/* Aulas (Topic solicitado) */}
                    <div className={`admin-nav-item ${activeTab === 'aulas' ? 'active' : ''}`} onClick={() => setActiveTab('aulas')}>📅 Cronograma</div>
                    <div className={`admin-nav-item ${activeTab === 'catalogo' ? 'active' : ''}`} onClick={() => setActiveTab('catalogo')}>📚 Catálogo</div>

                    {/* Gestão de Usuários (Restrito: Superadmin e Admin) */}
                    {hasRole(['superadmin', 'admin']) && (
                        <div className={`admin-nav-item ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>🔑 Usuários</div>
                    )}
                </nav>
                <div style={{ marginTop: 'auto', padding: '2rem' }}>
                    <button className="neon-btn small glow-pink" onClick={onLogout}>Sair do Painel</button>
                </div>
            </aside>
            <main className="admin-content">
                {renderContent()}
            </main>
        </div>
    );
};

const AdminDashboard = ({ stats }) => (
    <div className="fade-in">
        <h1 className="glow-text-cyan">Visão Geral</h1>
        <div className="admin-stat-grid">
            <div className="admin-stat-card"><h4>Total de Alunos</h4><p>{stats.users.length}</p></div>
            <div className="admin-stat-card"><h4>Equipamentos</h4><p>{stats.equipment.length}</p></div>
            <div className="admin-stat-card"><h4>Tickets Abertos</h4><p>{stats.tickets.filter(t => t.status === 'Aberto').length}</p></div>
            <div className="admin-stat-card"><h4>Novos este mês</h4><p>12</p></div>
        </div>
        <div className="glass-section" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3>Atividade Recente</h3>
            <p className="small-detail">Últimos logins e interações do sistema aparecerão aqui no futuro.</p>
        </div>
    </div>
);

const AdminStudents = ({ users, setUsers, currentUser }) => {
    const handleStatusUpdate = (userId, field, value) => {
        const updated = users.map(u => u.id === userId ? { ...u, [field]: value } : u);
        setUsers(updated);
        localStorage.setItem('extremegym_users', JSON.stringify(updated));
    };

    const isStaffOrAdmin = ['superadmin', 'admin', 'recepcao'].includes(currentUser.role);

    return (
        <div className="fade-in">
            <h1 className="glow-text-cyan">Gerenciamento de Alunos</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome/Usuário</th>
                            <th>Email</th>
                            <th>Cadastro</th>
                            <th>Pagamento</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(u => !['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'].includes(u.role)).map(user => (
                            <tr key={user.id}>
                                <td>{user.name || user.username}</td>
                                <td>{user.email || 'N/A'}</td>
                                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                                <td>
                                    {isStaffOrAdmin ? (
                                        <select
                                            value={user.paymentStatus || 'Pendente'}
                                            className="neon-input"
                                            style={{ padding: '5px', fontSize: '0.8rem' }}
                                            onChange={(e) => handleStatusUpdate(user.id, 'paymentStatus', e.target.value)}
                                        >
                                            <option value="Pago">Pago</option>
                                            <option value="Pendente">Pendente</option>
                                            <option value="Atrasado">Atrasado</option>
                                        </select>
                                    ) : (
                                        <span>{user.paymentStatus || 'Pendente'}</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status === 'Ativo' ? 'active' : 'inactive'}`}>
                                        {user.status || 'Ativo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminEquipment = ({ equipment, setEquipment }) => {
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', number: '', type: '', muscle: '', instructions: '' });

    const handleSave = (e) => {
        e.preventDefault();
        let newEquip;
        if (editing && editing.id) {
            newEquip = equipment.map(e => e.id === editing.id ? { ...e, ...formData } : e);
        } else {
            newEquip = [...equipment, { ...formData, id: Date.now(), status: 'Ativo' }];
        }
        setEquipment(newEquip);
        localStorage.setItem('extremegym_equipment', JSON.stringify(newEquip));
        setEditing(null);
        setFormData({ name: '', number: '', type: '', muscle: '', instructions: '' });
    };

    const handleDelete = (id) => {
        const newEquip = equipment.filter(e => e.id !== id);
        setEquipment(newEquip);
        localStorage.setItem('extremegym_equipment', JSON.stringify(newEquip));
    };

    const handleToggleStatus = (id) => {
        const newEquip = equipment.map(e => {
            if (e.id === id) {
                return { ...e, status: e.status === 'Ativo' ? 'Manutenção' : 'Ativo' };
            }
            return e;
        });
        setEquipment(newEquip);
        localStorage.setItem('extremegym_equipment', JSON.stringify(newEquip));
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="glow-text-cyan">Equipamentos</h1>
                <button className="neon-btn small" onClick={() => { setEditing('new'); setFormData({ name: '', number: '', type: '', muscle: '', instructions: '' }); }}>+ Novo Equipamento</button>
            </div>

            {editing && (
                <form className="admin-form fade-in" onSubmit={handleSave}>
                    <input className="neon-input" placeholder="Nome" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="neon-input" placeholder="Nº Equipamento" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={{ width: '120px' }} />
                    <input className="neon-input" placeholder="Tipo (ex: Peito)" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                    <input className="neon-input" placeholder="Músculo Alvo" value={formData.muscle} onChange={e => setFormData({ ...formData, muscle: e.target.value })} />
                    <textarea className="neon-input full-width" placeholder="Instruções" value={formData.instructions} onChange={e => setFormData({ ...formData, instructions: e.target.value })} />
                    <div className="btn-row full-width">
                        <button type="button" className="neon-btn secondary small" onClick={() => setEditing(null)}>Cancelar</button>
                        <button type="submit" className="neon-btn small">Salvar</button>
                    </div>
                </form>
            )}

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Equipamento / Nº</th>
                            <th>Tipo</th>
                            <th>Músculo</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map(item => (
                            <tr key={item.id}>
                                <td>{item.name} {item.number ? `/ ${item.number}` : ''}</td>
                                <td>{item.type}</td>
                                <td>{item.muscle}</td>
                                <td><span className={`status-badge ${item.status === 'Ativo' ? 'active' : 'inactive'}`}>{item.status}</span></td>
                                <td>
                                    <button className="nav-link" style={{ marginRight: '10px' }} onClick={() => { setEditing(item); setFormData(item); }}>Editar</button>
                                    <button
                                        className="nav-link"
                                        style={{ marginRight: '10px', color: item.status === 'Ativo' ? 'var(--neon-purple)' : 'var(--neon-cyan)' }}
                                        onClick={() => handleToggleStatus(item.id)}
                                    >
                                        {item.status === 'Ativo' ? 'Manutenção' : 'Ativar'}
                                    </button>
                                    <button className="nav-link" style={{ color: 'var(--neon-pink)' }} onClick={() => handleDelete(item.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminLessons = ({ lessons, setLessons, currentUser }) => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    // Filtro de instrutor
    const filteredLessons = currentUser.role === 'instrutor' 
        ? lessons.filter(l => l.instructor_id === currentUser.id) 
        : lessons;

    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ title: '', room: '', day: 'Segunda', time: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        const newLesson = {
            id: Date.now(),
            ...formData,
            instructor: currentUser.name,
            instructor_id: currentUser.id
        };
        const updated = [...lessons, newLesson];
        setLessons(updated);
        localStorage.setItem('extremegym_lessons', JSON.stringify(updated));
        setIsAdding(false);
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="glow-text-cyan">Quadro Semanal de Aulas</h1>
                {['superadmin', 'admin', 'instrutor'].includes(currentUser.role) && (
                    <button className="neon-btn small" onClick={() => setIsAdding(true)}>+ Agendar Aula</button>
                )}
            </div>

            {isAdding && (
                <form className="admin-form fade-in" onSubmit={handleAdd} style={{ marginBottom: '2rem' }}>
                    <input className="neon-input" placeholder="Título da Aula" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <input className="neon-input" placeholder="Sala" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
                    <select className="neon-input" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                        {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <input className="neon-input" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    <div className="btn-row full-width">
                        <button type="button" className="neon-btn secondary small" onClick={() => setIsAdding(false)}>Cancelar</button>
                        <button type="submit" className="neon-btn small">Confirmar</button>
                    </div>
                </form>
            )}

            <div className="weekly-board">
                {days.map(day => (
                    <div key={day} className="board-column">
                        <div className="board-day-header">{day}</div>
                        <div className="board-lesson-list">
                            {filteredLessons.filter(l => l.day === day).length > 0 ? (
                                filteredLessons.filter(l => l.day === day)
                                    .sort((a,b) => a.time.localeCompare(b.time))
                                    .map(lesson => (
                                    <div key={lesson.id} className="lesson-board-card">
                                        <div className="lesson-time">{lesson.time}</div>
                                        <div className="lesson-title">{lesson.title}</div>
                                        <div className="lesson-details">
                                            <span>👤 {lesson.instructor}</span>
                                            <span>📍 {lesson.room}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-lessons-text">Nenhuma aula</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminUserManagement = ({ users, setUsers, currentUser }) => {
    const roles = [
        { id: 'superadmin', label: 'Super Admin' },
        { id: 'admin', label: 'Admin' },
        { id: 'financeiro', label: 'Financeiro' },
        { id: 'recepcao', label: 'Recepção' },
        { id: 'instrutor', label: 'Instrutor' },
    ];

    const handleRoleChange = (userId, newRole) => {
        const targetUser = users.find(u => u.id === userId);
        const oldRole = targetUser.role;

        // Proteção: Admin não pode promover a Superadmin
        if (newRole === 'superadmin' && currentUser.role !== 'superadmin') {
            alert('Apenas Super Admins podem atribuir este cargo.');
            return;
        }

        const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
        setUsers(updated);
        localStorage.setItem('extremegym_users', JSON.stringify(updated));
        
        console.log(`LOG: Usuário [${currentUser.name}] alterou cargo de [${targetUser.username}] de [${oldRole}] para [${newRole}]`);
    };

    // Filtro de hierarquia: Admin não vê superadmins
    const visibleUsers = users.filter(u => {
        if (currentUser.role === 'admin' && u.role === 'superadmin') return false;
        return ['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'].includes(u.role);
    });

    return (
        <div className="fade-in">
            <h1 className="glow-text-cyan">Gestão de Staff</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Usuário</th>
                            <th>Cargo Atual</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleUsers.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.username}</td>
                                <td><span className="role-tag">{u.role.toUpperCase()}</span></td>
                                <td>
                                    <select 
                                        className="neon-input" 
                                        style={{ fontSize: '0.7rem', padding: '5px' }}
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        disabled={u.role === 'superadmin' && currentUser.role !== 'superadmin'}
                                    >
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.label}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminSupport = ({ tickets, setTickets }) => {
    const handleStatus = (id, newStatus) => {
        const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
        setTickets(updated);
        localStorage.setItem('extremegym_tickets', JSON.stringify(updated));
    };

    return (
        <div className="fade-in">
            <h1 className="glow-text-cyan">Tickets de Suporte</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Assunto</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id}>
                                <td>{t.user}</td>
                                <td>{t.subject}</td>
                                <td>{t.date}</td>
                                <td>
                                    <span style={{ color: t.status === 'Aberto' ? 'var(--neon-cyan)' : 'var(--text-secondary)' }}>
                                        {t.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="neon-btn small" style={{ fontSize: '0.6rem' }} onClick={() => handleStatus(t.id, 'Fechado')}>Fechar Ticket</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
