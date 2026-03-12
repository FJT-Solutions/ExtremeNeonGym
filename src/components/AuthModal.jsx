import React, { useState, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthModal = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        consentData: false,
        consentAI: false
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) error = 'Email inválido';
        }
        if (name === 'password') {
            const requirements = [
                { regex: /.{8,}/, msg: 'Mínimo 8 caracteres' },
                { regex: /[A-Z]/, msg: 'Uma letra maiúscula' },
                { regex: /[a-z]/, msg: 'Uma letra minúscula' },
                { regex: /[0-9]/, msg: 'Um número' },
                { regex: /[^A-Za-z0-9]/, msg: 'Um caractere especial' }
            ];
            const failed = requirements.filter(req => !req.regex.test(value));
            if (failed.length > 0) error = failed[0].msg;
        }
        if (name === 'confirmPassword') {
            if (value !== formData.password) error = 'Senhas não conferem';
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        if (!isLogin && type !== 'checkbox') {
            const error = validateField(name, val);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setGlobalError('')

        if (isLogin) {
            try {
                const userData = authService.login(formData.username, formData.password)
                onSuccess(userData)
            } catch (err) {
                setGlobalError(err.message)
            }
        } else {
            // Validate all fields
            const newErrors = {};
            Object.keys(formData).forEach(key => {
                if (key !== 'confirmPassword' && key !== 'consentData' && key !== 'consentAI' && !formData[key]) {
                    newErrors[key] = 'Campo obrigatório';
                } else {
                    const error = validateField(key, formData[key]);
                    if (error) newErrors[key] = error;
                }
            });

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            if (!formData.consentData || !formData.consentAI) {
                setGlobalError('Você deve aceitar os termos de consentimento.');
                return;
            }

            try {
                const userData = authService.signup(formData)
                onSuccess(userData)
            } catch (err) {
                setGlobalError(err.message)
            }
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content neon-border-purple ${!isLogin ? 'signup-modal' : ''}`} onClick={e => e.stopPropagation()} style={{ maxWidth: isLogin ? '400px' : '500px' }}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2 className="glow-text-pink">{isLogin ? 'Bem-vindo' : 'Junte-se ao Futuro'}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        type="text"
                        placeholder="Usuário"
                        className="neon-input"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    {errors.username && <p className="validation-error">{errors.username}</p>}

                    {!isLogin && (
                        <>
                            <input
                                name="email"
                                type="email"
                                placeholder="E-mail"
                                className="neon-input"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <p className="validation-error">{errors.email}</p>}

                            <input
                                name="phone"
                                type="tel"
                                placeholder="Telefone (DDD + Número)"
                                className="neon-input"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </>
                    )}

                    <input
                        name="password"
                        type="password"
                        placeholder="Senha"
                        className="neon-input"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <p className="validation-error">{errors.password}</p>}

                    {!isLogin && (
                        <>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirmar Senha"
                                className="neon-input"
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                            {errors.confirmPassword && <p className="validation-error">{errors.confirmPassword}</p>}

                            <div className="consent-group">
                                <label className="consent-item">
                                    <input type="checkbox" name="consentData" checked={formData.consentData} onChange={handleInputChange} />
                                    <span>Consinto com o uso dos meus dados pessoais para fins de geração de sugestões de treino personalizadas dentro da plataforma.</span>
                                </label>
                                <label className="consent-item">
                                    <input type="checkbox" name="consentAI" checked={formData.consentAI} onChange={handleInputChange} />
                                    <span>Compreendo que as sugestões de treino são geradas por IA e não substituem orientação profissional. Reconheço que a plataforma não se responsabiliza por lesões.</span>
                                </label>
                            </div>
                        </>
                    )}

                    {globalError && <p className="error-text">{globalError}</p>}

                    <button type="submit" className="neon-btn glow-pink">
                        {isLogin ? 'Entrar' : 'Criar Conta'}
                    </button>
                </form>

                <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                </p>
            </div>
        </div>
    )
}

export default AuthModal

