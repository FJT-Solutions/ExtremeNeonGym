import React from 'react'

const Contact = () => (
    <section id="contact" className="section glass-section">
        <h2 className="glow-text-purple">Fale Conosco</h2>
        <div className="contact-container">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nome" className="neon-input" />
                <input type="email" placeholder="Email" className="neon-input" />
                <textarea placeholder="Mensagem" className="neon-input"></textarea>
                <button className="neon-btn">Enviar Sinal</button>
            </form>
            <div className="contact-info">
                <p className="glow-text-cyan">📍 Setor Industrial, Lote 80</p>
                <p className="glow-text-cyan">📞 (11) 98765-4321</p>
                <div className="social-icons">
                    <span>Instagram</span> <span>Facebook</span> <span>TikTok</span>
                </div>
            </div>
        </div>
    </section>
)

export default Contact
