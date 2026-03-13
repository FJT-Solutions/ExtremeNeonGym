import React, { useState, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthModal = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        cpf: '',
        password: '',
        confirmPassword: '',
        consentData: false,
        consentAI: false
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [cpfValid, setCpfValid] = useState(null);

    const validateCPFDigits = (cpf) => {
        const c = cpf.replace(/\D/g, '');
        if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
        let r = (sum * 10) % 11;
        if (r === 10 || r === 11) r = 0;
        if (r !== parseInt(c[9])) return false;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
        r = (sum * 10) % 11;
        if (r === 10 || r === 11) r = 0;
        return r === parseInt(c[10]);
    };

    const formatCPF = (v) =>
        v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');

    const formatPhone = (v) =>
        v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');

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
        let val = type === 'checkbox' ? checked : value;
        if (name === 'cpf') val = formatCPF(value);
        if (name === 'phone') val = formatPhone(value);
        setFormData(prev => ({ ...prev, [name]: val }));
        if (!isLogin && type !== 'checkbox') {
            const error = validateField(name, val);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleCPFBlur = () => {
        const raw = formData.cpf.replace(/\D/g, '');
        if (raw.length === 11) {
            const valid = validateCPFDigits(raw);
            setCpfValid(valid);
            if (!valid) setErrors(p => ({ ...p, cpf: 'CPF inválido. Verifique os números informados.' }));
            else setErrors(p => ({ ...p, cpf: '' }));
        } else if (raw.length > 0) {
            setCpfValid(false);
            setErrors(p => ({ ...p, cpf: 'CPF incompleto.' }));
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

            if (cpfValid !== true) {
                setGlobalError('CPF inválido. Por favor revise o CPF informado.');
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

                            <div style={{ position: 'relative' }}>
                                <input
                                    name="cpf"
                                    type="text"
                                    placeholder="CPF (000.000.000-00)"
                                    className={`neon-input ${cpfValid === false ? 'error-input' : cpfValid === true ? 'success-input' : ''}`}
                                    required
                                    maxLength={14}
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                    onBlur={handleCPFBlur}
                                />
                                {cpfValid === true && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-cyan)' }}>✔</span>}
                                {cpfValid === false && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-pink)' }}>✖</span>}
                            </div>
                            {errors.cpf && <p className="validation-error">{errors.cpf}</p>}

                            <input
                                name="phone"
                                type="tel"
                                placeholder="Telefone (DDD + Número)"
                                className="neon-input"
                                required
                                maxLength={15}
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <p className="validation-error">{errors.phone}</p>}
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

