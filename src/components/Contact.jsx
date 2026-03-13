import React from 'react'

const Contact = () => (
    <section id="contact" className="section glass-section contact-section">
        <h2 className="glow-text-purple">Conecte-se à Rede</h2>
        <div className="contact-container">
            <form className="contact-form neon-border-purple" onSubmit={(e) => e.preventDefault()}>
                <div className="form-header">
                    <h3>Mande uma Mensagem</h3>
                    <p>Nossa equipe de suporte responderá em breve.</p>
                </div>
                <input type="text" placeholder="Seu Nome" className="neon-input" required />
                <input type="email" placeholder="Seu E-mail" className="neon-input" required />
                <textarea placeholder="Como podemos ajudar?" className="neon-input" rows="5" required></textarea>
                <button className="neon-btn glow-purple">Enviar Sinal</button>
            </form>
            
            <div className="contact-info-panel">
                <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-text">
                        <h4>Localização</h4>
                        <p>Setor Industrial, Lote 80, SP</p>
                    </div>
                </div>
                
                <div className="info-item">
                    <div className="info-icon">📞</div>
                    <div className="info-text">
                        <h4>Telefone</h4>
                        <p>(11) 98765-4321</p>
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-icon">📧</div>
                    <div className="info-text">
                        <h4>E-mail</h4>
                        <p>suporte@extremegym.com</p>
                    </div>
                </div>

                <div className="social-connect">
                    <h4>Siga-nos</h4>
                    <div className="social-btns">
                        <button className="social-icon-btn ig">IG</button>
                        <button className="social-icon-btn fb">FB</button>
                        <button className="social-icon-btn tk">TK</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default Contact
