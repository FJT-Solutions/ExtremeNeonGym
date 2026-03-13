import React from 'react'

const Footer = () => (
    <footer className="footer-main">
        <div className="footer-container">
            {/* Column 1 - Logo & App */}
            <div className="footer-col col-logo">
                <div className="footer-logo glow-text-pink">ExtremeGym</div>
                <div className="app-promo">
                    <div className="qr-placeholder">QR CODE</div>
                    <div className="app-text">
                        <p>Acesse nosso app</p>
                        <span>Treinos personalizados</span>
                        <span>Planos exclusivos</span>
                    </div>
                </div>
                <div className="footer-socials">
                    <a href="#" className="social-icon">IG</a>
                    <a href="#" className="social-icon">FB</a>
                    <a href="#" className="social-icon">YT</a>
                    <a href="#" className="social-icon">TT</a>
                    <a href="#" className="social-icon">IN</a>
                </div>
            </div>

            {/* Column 2 - Treinos */}
            <div className="footer-col">
                <h4>Treinos</h4>
                <ul>
                    <li><a href="#">Treinos personalizados</a></li>
                    <li><a href="#">Musculação</a></li>
                    <li><a href="#">Funcional</a></li>
                    <li><a href="#">Treino para iniciantes</a></li>
                    <li><a href="#">Treino avançado</a></li>
                </ul>
            </div>

            {/* Column 3 - Academia */}
            <div className="footer-col">
                <h4>Academia</h4>
                <ul>
                    <li><a href="#about">Sobre nós</a></li>
                    <li><a href="#units">Unidades</a></li>
                    <li><a href="#classes">Aulas</a></li>
                    <li><a href="#plans">Planos</a></li>
                    <li><a href="#">Professores</a></li>
                </ul>
            </div>

            {/* Column 4 - Área do Aluno */}
            <div className="footer-col">
                <h4>Área do Aluno</h4>
                <ul>
                    <li><a href="#">Área logada</a></li>
                    <li><a href="#">Gerar treino com IA</a></li>
                    <li><a href="#">Suporte</a></li>
                    <li><a href="#">Perguntas frequentes</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-info">
            <div className="info-units">
                <div className="unit-info">
                    <strong>Unidade Centro</strong>
                    <p>São Paulo | Rua Exemplo, 123 – CEP 00000-000</p>
                    <p>Telefone: (11) 0000-0000</p>
                </div>
                <div className="unit-info">
                    <strong>Unidade Zona Sul</strong>
                    <p>São Paulo | Av. Paulista, 1000 – CEP 00000-000</p>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <div className="legal-links">
                <a href="#">Política de Privacidade</a>
                <a href="#">Política de Cookies</a>
                <a href="#">Gerenciar Cookies</a>
            </div>
            <p className="copyright">© 2026 ExtremeGym – Todos os direitos reservados</p>
        </div>
    </footer>
)

export default Footer
