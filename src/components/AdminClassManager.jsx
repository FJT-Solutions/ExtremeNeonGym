import React, { useState, useEffect } from 'react';
import { classService } from '../services/classCatalog';

const AdminClassManager = () => {
    const [catalog, setCatalog] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        image_url: '',
        status: 'ativa',
        schedule: '',
        instructor: ''
    });

    useEffect(() => {
        setCatalog(classService.getCatalog());
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        let updated;
        if (currentClass) {
            updated = catalog.map(c => c.id === currentClass.id ? { ...formData, id: c.id } : c);
        } else {
            updated = [...catalog, { ...formData, id: Date.now() }];
        }
        setCatalog(updated);
        classService.saveCatalog(updated);
        setIsEditing(false);
        setCurrentClass(null);
        setFormData({ name: '', category: '', description: '', image_url: '', status: 'ativa', schedule: '', instructor: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Excluir esta aula do catálogo?')) {
            const updated = catalog.filter(c => c.id !== id);
            setCatalog(updated);
            classService.saveCatalog(updated);
        }
    };

    const startEdit = (cls) => {
        setCurrentClass(cls);
        setFormData(cls);
        setIsEditing(true);
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="glow-text-cyan">Catálogo de Modalidades</h1>
                {!isEditing && (
                    <button className="neon-btn small" onClick={() => setIsEditing(true)}>+ Adicionar Modalidade</button>
                )}
            </div>

            {isEditing && (
                <form className="admin-form fade-in" onSubmit={handleSave} style={{ marginBottom: '3rem' }}>
                    <div className="full-width">
                        <h3 className="glow-text-pink">{currentClass ? 'Editar Aula' : 'Nova Aula'}</h3>
                    </div>
                    <input className="neon-input" placeholder="Nome da Aula" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input className="neon-input" placeholder="Categoria (ex: AERÓBICO)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    <input className="neon-input" placeholder="URL da Imagem" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                    <select className="neon-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="ativa">Ativa</option>
                        <option value="inativa">Inativa</option>
                    </select>
                    <input className="neon-input" placeholder="Instrutor Padrão" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} />
                    <input className="neon-input" placeholder="Horário Sugerido" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} />
                    <textarea className="neon-input full-width" placeholder="Descrição da Aula" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ minHeight: '100px' }} />
                    
                    <div className="btn-row full-width">
                        <button type="button" className="neon-btn secondary small" onClick={() => { setIsEditing(false); setCurrentClass(null); }}>Cancelar</button>
                        <button type="submit" className="neon-btn small">Salvar Modalidade</button>
                    </div>
                </form>
            )}

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {catalog.map(cls => (
                            <tr key={cls.id}>
                                <td>
                                    <div style={{ width: '50px', height: '30px', borderRadius: '4px', backgroundSize: 'cover', backgroundImage: `url(${cls.image_url})` }}></div>
                                </td>
                                <td><strong>{cls.name}</strong></td>
                                <td>{cls.category}</td>
                                <td>
                                    <span className={`status-badge ${cls.status}`}>
                                        {cls.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button className="neon-btn small cyan" onClick={() => startEdit(cls)}>Editar</button>
                                    <button className="neon-btn small pink" onClick={() => handleDelete(cls.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminClassManager;
