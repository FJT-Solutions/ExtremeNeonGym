import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { trainingService } from '../services/training';
import { exerciseDBService } from '../services/exerciseDB';
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
            case 'equipamentos': return <AdminEquipment equipment={equipment} setEquipment={setEquipment} currentUser={user} />;
            case 'suporte': return <AdminSupport tickets={tickets} setTickets={setTickets} />;
            case 'aulas': return <AdminLessons lessons={lessons} setLessons={setLessons} currentUser={user} />;
            case 'catalogo': return <AdminClassManager />;
            case 'usuarios': return <AdminUserManagement users={users} setUsers={setUsers} currentUser={user} />;
            default: return <AdminDashboard stats={{ users, equipment, tickets }} />;
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
                    
                    {/* Menus based on Role Rules */}
                    {hasRole(['superadmin', 'admin', 'recepcao', 'financeiro', 'instrutor']) && (
                        <div className={`admin-nav-item ${activeTab === 'alunos' ? 'active' : ''}`} onClick={() => setActiveTab('alunos')}>👥 Alunos</div>
                    )}
                    {hasRole(['superadmin', 'admin', 'recepcao']) && (
                        <div className={`admin-nav-item ${activeTab === 'equipamentos' ? 'active' : ''}`} onClick={() => setActiveTab('equipamentos')}>🏋️ Equipamentos</div>
                    )}
                    {hasRole(['superadmin', 'admin', 'recepcao']) && (
                        <div className={`admin-nav-item ${activeTab === 'suporte' ? 'active' : ''}`} onClick={() => setActiveTab('suporte')}>📩 Suporte</div>
                    )}
                    
                    {hasRole(['superadmin', 'instrutor']) && (
                        <div className={`admin-nav-item ${activeTab === 'aulas' ? 'active' : ''}`} onClick={() => setActiveTab('aulas')}>📅 Quadro de Aulas</div>
                    )}
                    
                    {hasRole(['superadmin']) && (
                        <div className={`admin-nav-item ${activeTab === 'catalogo' ? 'active' : ''}`} onClick={() => setActiveTab('catalogo')}>📚 Catálogo</div>
                    )}
                    
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
    const [editingUser, setEditingUser] = useState(null);

    const isSuperOrAdmin = ['superadmin', 'admin'].includes(currentUser.role);
    const isFinOrRecep = ['financeiro', 'recepcao'].includes(currentUser.role);
    const isInstrutor = currentUser.role === 'instrutor';

    const canEditAll = isSuperOrAdmin;
    const canEditStatus = isSuperOrAdmin || isFinOrRecep;
    const canEditMed = isSuperOrAdmin || isInstrutor;

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const formatPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4,5})(\d{4})/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const handleSave = (e) => {
        e.preventDefault();
        const updated = users.map(u => u.id === editingUser.id ? editingUser : u);
        setUsers(updated);
        localStorage.setItem('extremegym_users', JSON.stringify(updated));
        setEditingUser(null);
    };

    if (editingUser) {
        return (
            <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="glow-text-cyan">Editar Aluno: {editingUser.name || editingUser.username}</h1>
                    <button className="neon-btn small secondary" onClick={() => setEditingUser(null)}>Voltar para Tabela</button>
                </div>
                <form className="admin-form" onSubmit={handleSave} style={{ marginTop: '2rem', background: 'rgba(20,20,30,0.8)', padding: '2rem', borderRadius: '10px', border: '1px solid var(--neon-cyan)' }}>
                    
                    <h3 className="glow-text-purple" style={{ marginBottom: '1rem' }}>Dados Pessoais</h3>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label className="small-detail">Nome {canEditAll ? '' : '(Bloqueado)'}</label>
                            <input className={`neon-input full-width ${!canEditAll ? 'disabled' : ''}`} value={editingUser.name || editingUser.username || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} readOnly={!canEditAll} />
                        </div>
                        <div>
                            <label className="small-detail">CPF {canEditAll ? '' : '(Bloqueado)'}</label>
                            <input className={`neon-input full-width ${!canEditAll ? 'disabled' : ''}`} placeholder="000.000.000-00" maxLength={14} value={editingUser.cpf || ''} onChange={e => setEditingUser({...editingUser, cpf: formatCPF(e.target.value)})} readOnly={!canEditAll} />
                        </div>
                        <div>
                            <label className="small-detail">Telefone {canEditAll ? '' : '(Bloqueado)'}</label>
                            <input className={`neon-input full-width ${!canEditAll ? 'disabled' : ''}`} placeholder="(00) 00000-0000" maxLength={15} value={editingUser.telefone || ''} onChange={e => setEditingUser({...editingUser, telefone: formatPhone(e.target.value)})} readOnly={!canEditAll} />
                        </div>
                    </div>

                    <h3 className="glow-text-purple" style={{ marginBottom: '1rem' }}>Matrícula & Plano</h3>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label className="small-detail">Plano Atual {canEditStatus ? '' : '(Bloqueado)'}</label>
                            <select className={`neon-input full-width ${!canEditStatus ? 'disabled' : ''}`} value={editingUser.plano || ''} onChange={e => setEditingUser({...editingUser, plano: e.target.value})} disabled={!canEditStatus}>
                                <option value="">Sem Plano Definido</option>
                                <option value="Mensal (R$ 100)">Mensal (R$ 100)</option>
                                <option value="Semestral (R$ 550)">Semestral (R$ 550)</option>
                                <option value="Anual (R$ 1000)">Anual (R$ 1000)</option>
                            </select>
                        </div>
                        <div>
                            <label className="small-detail">Status da Matrícula {canEditStatus ? '' : '(Bloqueado)'}</label>
                            <select className={`neon-input full-width ${!canEditStatus ? 'disabled' : ''}`} value={editingUser.statusMatricula || editingUser.status || 'Ativo'} onChange={e => setEditingUser({...editingUser, statusMatricula: e.target.value, status: e.target.value})} disabled={!canEditStatus}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                                <option value="Pendente">Pendente</option>
                            </select>
                        </div>
                    </div>

                    <h3 className="glow-text-pink" style={{ marginBottom: '1rem' }}>Ficha de Saúde</h3>
                    <div>
                        <label className="small-detail glow-text-pink">Observações Médicas {canEditMed ? '' : '(Bloqueado)'}</label>
                        <p className="small-detail" style={{marginBottom: '10px'}}>Instruções clínicas, lesões, laudos ou restrições (ex: epicondilite, hipertensão).</p>
                        <textarea className={`neon-input full-width ${!canEditMed ? 'disabled' : ''}`} value={editingUser.observacoesMedicas || ''} onChange={e => setEditingUser({...editingUser, observacoesMedicas: e.target.value})} readOnly={!canEditMed} rows="4" placeholder="Nenhuma observação registrada."></textarea>
                    </div>

                    <div className="btn-row full-width" style={{ marginTop: '2rem' }}>
                        <button type="submit" className="neon-btn glow-cyan">Salvar Informações</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h1 className="glow-text-cyan">Gerenciamento de Alunos</h1>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome/Usuário</th>
                            <th>Plano</th>
                            <th>Status Matrícula</th>
                            <th>Cadastro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(u => !['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'].includes(u.role)).map(user => (
                            <tr key={user.id}>
                                <td>
                                    <strong>{user.name || user.username}</strong>
                                    <div style={{fontSize: '0.75rem', color: '#ccc', marginTop: '4px'}}>
                                        CPF: {user.cpf || 'Não Infs.'} | Tel: {user.telefone || 'Não Inf.'}
                                    </div>
                                    {user.observacoesMedicas && (
                                        <div style={{fontSize: '0.7rem', color: 'var(--neon-pink)', marginTop: '2px'}}>⚠️ Possui Observações Médicas</div>
                                    )}
                                </td>
                                <td>{user.plano || 'Sem Plano'}</td>
                                <td>
                                    <span className={`status-badge ${(user.statusMatricula || user.status) === 'Ativo' ? 'active' : 'inactive'}`}>
                                        {user.statusMatricula || user.status || 'Ativo'}
                                    </span>
                                </td>
                                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                                <td>
                                    <button className="neon-btn small" onClick={() => setEditingUser(user)}>Detalhes / Editar</button>
                                </td>
                            </tr>
                        ))}
                        {users.filter(u => !['superadmin', 'admin', 'financeiro', 'recepcao', 'instrutor'].includes(u.role)).length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum aluno cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminEquipment = ({ equipment, setEquipment, currentUser }) => {
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', body_part: '', target_muscle: '', type: '', instructions: '', gif_url: '', exercise_id: '', number: '', status: 'Ativo' });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const isSuperAdmin = currentUser?.role === 'superadmin';

    // Seeding API local mock se não houver dados (preservando legados)
    useEffect(() => {
        if (!localStorage.getItem('extremegym_equipment') && equipment.length < 3) {
           const initialData = [
               { id: 1, name: 'Supino Reto', exercise_id: 'ex_001', number: '01', type: 'Barbell', target_muscle: 'Peitoral maior', body_part: 'Peito', status: 'Ativo', instructions: 'Deite no banco e empurre a barra com os braços.', gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndzB6M3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx8y90680U/giphy.gif' }
           ];
           setEquipment(initialData);
           localStorage.setItem('extremegym_equipment', JSON.stringify(initialData));
        }
    }, []);

    useEffect(() => {
        if (searchTerm.length > 2) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                exerciseDBService.searchExercises(searchTerm).then(results => {
                    setSearchResults(results);
                    setIsSearching(false);
                });
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchTerm]);

    const handleSelectExercise = (ex) => {
        setFormData({
            ...formData,
            exercise_id: ex.exercise_id,
            name: ex.name,
            body_part: ex.body_part,
            target_muscle: ex.target_muscle,
            type: ex.equipment_type,
            gif_url: ex.gif_url,
            instructions: ex.instructions
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!isSuperAdmin) {
            alert('Acesso negado. Apenas super administradores podem modificar equipamentos.');
            return;
        }

        if (!formData.exercise_id) {
            alert('Por favor, selecione um exercício do catálogo primeiro.');
            return;
        }

        let newEquip;
        if (editing && editing.id) {
            newEquip = equipment.map(e => e.id === editing.id ? { ...e, ...formData } : e);
        } else {
            newEquip = [...equipment, { ...formData, id: Date.now() }];
        }
        setEquipment(newEquip);
        localStorage.setItem('extremegym_equipment', JSON.stringify(newEquip));
        setEditing(null);
    };

    const handleDelete = (id) => {
        if (!isSuperAdmin) return;
        const newEquip = equipment.filter(e => e.id !== id);
        setEquipment(newEquip);
        localStorage.setItem('extremegym_equipment', JSON.stringify(newEquip));
    };

    const handleToggleStatus = (id) => {
        if (!isSuperAdmin) return;
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
                {isSuperAdmin && (
                    <button className="neon-btn small" onClick={() => { 
                        setEditing('new'); 
                        setFormData({ name: '', body_part: '', target_muscle: '', type: '', instructions: '', gif_url: '', exercise_id: '', number: '', status: 'Ativo' }); 
                        setSearchTerm('');
                    }}>
                        + Adicionar Equipamento
                    </button>
                )}
            </div>

            {editing && isSuperAdmin && (
                <form className="admin-form fade-in" onSubmit={handleSave} style={{ position: 'relative', background: 'rgba(20, 20, 30, 0.8)', padding: '2rem', borderRadius: '10px', border: '1px solid var(--neon-purple)', marginTop: '1rem' }}>
                    <h2 className="glow-text-purple" style={{marginBottom: '0.5rem'}}>Adicionar via API ExerciseDB</h2>
                    <p style={{marginBottom: '1.5rem', color: '#ccc', fontSize: '0.9rem'}}>Pesquise pelo exercício desejado abaixo. Todos os dados (nome, músculo, gif) serão preenchidos automaticamente.<br/>A única coisa que você precisará digitar manualmente é o <strong style={{color: 'var(--neon-pink)'}}>Número do Equipamento</strong> e seu Status.</p>
                    
                    <div style={{ marginBottom: '2rem', position: 'relative' }}>
                        <input 
                            className="neon-input full-width" 
                            placeholder="➡️ Digite aqui para pesquisar um exercício (ex: supino)..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            style={{ fontSize: '1.2rem', padding: '1rem', border: '2px solid var(--neon-cyan)' }}
                        />
                        {isSearching && <span className="glow-text-pink" style={{ position: 'absolute', right: '15px', top: '20px' }}>Buscando...</span>}
                        {searchResults.length > 0 && (
                            <div className="autocomplete-dropdown glass-panel fade-in neon-border-blue" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, maxHeight: '300px', overflowY: 'auto', background: '#111' }}>
                                {searchResults.map(ex => (
                                    <div 
                                        key={ex.exercise_id} 
                                        className="autocomplete-item"
                                        style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                                        onClick={() => handleSelectExercise(ex)}
                                    >
                                        <img src={ex.gif_url} alt="gif" style={{width: '60px', borderRadius: '5px'}}/>
                                        <div>
                                            <strong style={{color: 'var(--neon-cyan)', fontSize: '1.1rem'}}>{ex.name}</strong> 
                                            <div style={{fontSize: '0.8rem', color: 'gray'}}>Músculo: {ex.target_muscle} | Equip: {ex.equipment_type}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', opacity: formData.exercise_id ? 1 : 0.4 }}>
                        <div>
                            <label className="small-detail glow-text-cyan">Nome do Exercício (Apenas Leitura)</label>
                            <input className="neon-input full-width disabled" value={formData.name || ''} readOnly placeholder="Automático da API..." />
                        </div>
                        <div>
                            <label className="small-detail glow-text-cyan">Parte do Corpo (Apenas Leitura)</label>
                            <input className="neon-input full-width disabled" value={formData.body_part || ''} readOnly placeholder="Automático da API..." />
                        </div>
                        <div>
                            <label className="small-detail glow-text-cyan">Músculo Alvo (Apenas Leitura)</label>
                            <input className="neon-input full-width disabled" value={formData.target_muscle || formData.muscle || ''} readOnly placeholder="Automático da API..." />
                        </div>
                        <div>
                            <label className="small-detail glow-text-cyan">Tipo de Equipamento (Apenas Leitura)</label>
                            <input className="neon-input full-width disabled" value={formData.type || ''} readOnly placeholder="Automático da API..." />
                        </div>
                    </div>

                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label className="small-detail">Número do Equipamento</label>
                            <input className="neon-input full-width" placeholder="Ex: 07" value={formData.number || ''} onChange={e => setFormData({ ...formData, number: e.target.value })} required />
                        </div>
                        <div>
                            <label className="small-detail">Status</label>
                            <select className="neon-input full-width" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Ativo">Ativo</option>
                                <option value="Manutenção">Manutenção</option>
                            </select>
                        </div>
                    </div>

                    {formData.gif_url && (
                        <div style={{ margin: '1rem 0' }}>
                            <img src={formData.gif_url} alt="Demonstração" style={{ height: '100px', borderRadius: '8px', border: '1px solid var(--neon-cyan)' }} />
                        </div>
                    )}

                    <div className="btn-row full-width" style={{ marginTop: '1.5rem' }}>
                        <button type="button" className="neon-btn secondary small" onClick={() => { setEditing(null); setSearchTerm(''); setSearchResults([]); }}>Cancelar</button>
                        <button type="submit" className="neon-btn small glow-cyan">Salvar Equipamento</button>
                    </div>
                </form>
            )}

            <div className="admin-table-container mt-2">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Exercício</th>
                            <th>Tipo (Equip.)</th>
                            <th>Músculo Alvo</th>
                            <th>Status</th>
                            {isSuperAdmin && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map(item => (
                            <tr key={item.id}>
                                <td>{item.number ? String(item.number).padStart(2, '0') : '-'}</td>
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td>{item.target_muscle || item.muscle}</td>
                                <td><span className={`status-badge ${item.status === 'Ativo' ? 'active' : 'inactive'}`}>{item.status}</span></td>
                                {isSuperAdmin && (
                                    <td>
                                        <button className="nav-link" style={{ marginRight: '10px' }} onClick={() => { setEditing(item); setFormData({
                                            ...item,
                                            target_muscle: item.target_muscle || item.muscle, 
                                            body_part: item.body_part || 'Desconhecido',
                                            gif_url: item.gif_url || ''
                                        }); }}>Editar</button>
                                        <button
                                            className="nav-link"
                                            style={{ marginRight: '10px', color: item.status === 'Ativo' ? 'var(--neon-purple)' : 'var(--neon-cyan)' }}
                                            onClick={() => handleToggleStatus(item.id)}
                                        >
                                            {item.status === 'Ativo' ? 'Manutenção' : 'Ativar'}
                                        </button>
                                        <button className="nav-link" style={{ color: 'var(--neon-pink)' }} onClick={() => handleDelete(item.id)}>Excluir</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {equipment.length === 0 && (
                            <tr><td colSpan={isSuperAdmin ? "6" : "5"} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum equipamento cadastrado.</td></tr>
                        )}
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
