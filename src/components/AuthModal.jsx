import React, { useState } from 'react'
import { authService } from '../services/auth'

const AuthModal = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            if (isLogin) {
                const userData = authService.login(username, password)
                onSuccess(userData)
            } else {
                const userData = authService.signup(username, password)
                onSuccess(userData)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content neon-border-purple" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2 className="glow-text-pink">{isLogin ? 'Login' : 'Cadastro'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Usuário"
                        className="neon-input"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="neon-input"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="neon-btn">
                        {isLogin ? 'Entrar' : 'Registrar'}
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
