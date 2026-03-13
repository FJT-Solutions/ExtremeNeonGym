import React, { useState } from 'react'

const UPGRADES = [
    {
        id: 'avaliacao',
        title: 'Avaliação Corporal',
        price: 19.90,
        icon: '📊',
        features: ['Composição corporal completa', 'Gráfico de evolução mensal', 'Gordura, massa magra e hidratação']
    },
    {
        id: 'coaching',
        title: 'Coach de Treino',
        price: 39.90,
        icon: '🧑‍💼',
        features: ['Consultas online com treinador', 'Treinos personalizados semanais', 'Chat direto + ajuste de evolução']
    }
];

const formatCPF = (v) =>
    v.replace(/\D/g, '').slice(0, 11)
     .replace(/(\d{3})(\d)/, '$1.$2')
     .replace(/(\d{3})(\d)/, '$1.$2')
     .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const formatPhone = (v) =>
    v.replace(/\D/g, '').slice(0, 11)
     .replace(/(\d{2})(\d)/, '($1) $2')
     .replace(/(\d{5})(\d)/, '$1-$2');

const formatCard = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (v) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');

const validateCPFDigits = (cpf) => {
    const c = cpf.replace(/\D/g, '');
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
    let r = (sum * 10) % 11;
    if (r >= 10) r = 0;
    if (r !== parseInt(c[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
    r = (sum * 10) % 11;
    if (r >= 10) r = 0;
    return r === parseInt(c[10]);
};

const PlanCheckout = ({ plan, onBack }) => {
    // Upgrades
    const [selectedUpgrades, setSelectedUpgrades] = useState([]);
    // Coupon
    const [couponOpen, setCouponOpen] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMsg, setCouponMsg] = useState('');
    // Profile
    const [profile, setProfile] = useState({ nome: '', cpf: '', nascimento: '', telefone: '', email: '' });
    const [cpfStatus, setCpfStatus] = useState(null); // null | 'valid' | 'invalid'
    // Photo
    const [photoPreview, setPhotoPreview] = useState(null);
    // Legal
    const [checks, setChecks] = useState({ terms: false, privacy: false, fitness: false, image: false });
    // Signature
    const [signature, setSignature] = useState('');
    // Payment
    const [payMethod, setPayMethod] = useState('credit');
    const [card, setCard] = useState({ numero: '', nome: '', validade: '', cvv: '', parcelas: '1' });
    // Submit state
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // ── COMPUTED ──
    const upgradeTotal = UPGRADES.filter(u => selectedUpgrades.includes(u.id)).reduce((s, u) => s + u.price, 0);
    const monthly = plan.price + upgradeTotal - discount;

    const profileOk = profile.nome.trim().length >= 3 && cpfStatus === 'valid' && profile.nascimento && profile.telefone.replace(/\D/g,'').length >= 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email);
    const checksOk = Object.values(checks).every(Boolean);
    const paymentOk = payMethod === 'pix' || (card.numero.replace(/\s/g,'').length === 16 && card.nome.trim().length >= 3 && card.validade.length === 5 && card.cvv.length >= 3);
    const canSubmit = profileOk && photoPreview && checksOk && signature.trim().length >= 3 && paymentOk;

    // Requirements checklist for UX hint
    const reqs = [
        { label: 'Dados pessoais preenchidos', ok: profileOk },
        { label: 'Foto do rosto enviada', ok: !!photoPreview },
        { label: 'Confirmações legais aceitas', ok: checksOk },
        { label: 'Assinatura digital', ok: signature.trim().length >= 3 },
        { label: 'Dados de pagamento', ok: paymentOk },
    ];

    // ── HANDLERS ──
    const toggleUpgrade = (id) =>
        setSelectedUpgrades(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const applyCoupon = () => {
        const code = coupon.trim().toUpperCase();
        if (code === 'EXTREME10') {
            setDiscount(10);
            setCouponMsg('✔ Cupom EXTREME10 aplicado! Desconto de R$ 10,00');
        } else if (code === 'PROMO20') {
            setDiscount(20);
            setCouponMsg('✔ Cupom PROMO20 aplicado! Desconto de R$ 20,00');
        } else {
            setDiscount(0);
            setCouponMsg('✖ Cupom inválido ou expirado.');
        }
    };

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleCPFChange = (val) => {
        const formatted = formatCPF(val);
        setProfile(p => ({ ...p, cpf: formatted }));
        setCpfStatus(null);
    };

    const validateCPF = () => {
        const raw = profile.cpf.replace(/\D/g, '');
        if (raw.length === 11) setCpfStatus(validateCPFDigits(raw) ? 'valid' : 'invalid');
        else if (raw.length > 0) setCpfStatus('invalid');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 2000);
    };

    // ── SUCCESS SCREEN ──
    if (submitted) {
        return (
            <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '550px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'pulse 1.5s ease infinite' }}>✅</div>
                    <h1 className="glow-text-cyan" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Assinatura Confirmada!</h1>
                    <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '2rem' }}>
                        Bem-vindo ao <strong style={{ color: 'var(--neon-pink)' }}>{plan.name}</strong>! Seu acesso foi ativado com sucesso.
                    </p>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)', marginBottom: '2rem', textAlign: 'left' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'var(--neon-cyan)' }}>📋 Resumo da Assinatura</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#aaa' }}>Plano</span><strong>{plan.name}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#aaa' }}>Pagamento</span><strong>{payMethod === 'pix' ? 'PIX' : payMethod === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#aaa' }}>Total mensal</span><strong className="glow-text-cyan">R$ {monthly.toFixed(2)}</strong></div>
                        {payMethod === 'pix' && (
                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,255,255,0.05)', borderRadius: '10px', textAlign: 'center', border: '1px dashed rgba(0,255,255,0.3)' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>QR Code PIX</p>
                                <div style={{ width: '140px', height: '140px', background: '#fff', margin: '0 auto 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>⚡</div>
                                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Escaneie com o app do seu banco. Expira em 30 minutos.</p>
                                <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--neon-cyan)', marginTop: '8px', wordBreak: 'break-all' }}>extremegym@pix.banco.br</p>
                            </div>
                        )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2rem' }}>Um e-mail de confirmação foi enviado para <strong>{profile.email}</strong>.</p>
                    <button className="neon-btn glow-cyan" onClick={onBack} style={{ padding: '1rem 3rem' }}>Ir para meu Painel →</button>
                </div>
            </div>
        );
    }

    // ── LOADING ──
    if (loading) {
        return (
            <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ fontSize: '3rem' }}>🔐</div>
                <h2 className="glow-text-cyan">Processando pagamento seguro...</h2>
                <div className="progress-bar" style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="progress-fill" style={{ width: '100%', animation: 'gradient-move 1.5s infinite' }}></div>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Por favor, não feche esta janela.</p>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'rgba(5, 8, 18, 0.99)' }}>
            {/* Header */}
            <div style={{ maxWidth: '1140px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <button className="nav-link" onClick={onBack}>← Voltar</button>
                <div>
                    <h2 className="glow-text-cyan" style={{ margin: 0, fontSize: '1.6rem' }}>Finalizar Assinatura</h2>
                    <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>🔒 Ambiente 100% seguro com criptografia SSL</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    {['VISA', 'MC', 'PIX', 'ELO'].map(b => (
                        <span key={b} style={{ padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '5px', fontSize: '0.7rem', color: '#aaa', fontWeight: 'bold' }}>{b}</span>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 370px', gap: '2rem', alignItems: 'start' }}>

                {/* ══════════════ LEFT ══════════════ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Upgrades */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '15px', border: '1px solid rgba(0,255,255,0.15)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Quer melhorar seus resultados? 🔥</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {UPGRADES.map(u => {
                                const sel = selectedUpgrades.includes(u.id);
                                return (
                                    <label key={u.id} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer', border: `2px solid ${sel ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.08)'}`, background: sel ? 'rgba(0,255,255,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.25s' }}>
                                        <div style={{ paddingTop: '2px' }}>
                                            <input type="checkbox" checked={sel} onChange={() => toggleUpgrade(u.id)} style={{ width: '20px', height: '20px', accentColor: 'var(--neon-cyan)', cursor: 'pointer' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                <strong style={{ color: sel ? 'var(--neon-cyan)' : '#fff', fontSize: '1rem' }}>{u.icon} {u.title}</strong>
                                                <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>+ R$ {u.price.toFixed(2)}/mês</span>
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                {u.features.map((f, i) => <li key={i} style={{ fontSize: '0.83rem', color: '#999' }}>✔ {f}</li>)}
                                            </ul>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Personal Data */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '15px', border: '1px solid rgba(0,255,255,0.15)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>👤 Dados Pessoais</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nome Completo *</label>
                                <input className="neon-input full-width" placeholder="João da Silva Oliveira" value={profile.nome} onChange={e => setProfile(p => ({ ...p, nome: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    CPF *
                                    {cpfStatus === 'valid' && <span style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem', fontWeight: 'bold' }}>✔ Válido</span>}
                                    {cpfStatus === 'invalid' && <span style={{ color: 'var(--neon-pink)', fontSize: '0.85rem', fontWeight: 'bold' }}>✖ Inválido</span>}
                                </label>
                                <input
                                    className={`neon-input full-width${cpfStatus === 'invalid' ? ' error-input' : cpfStatus === 'valid' ? ' success-input' : ''}`}
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    value={profile.cpf}
                                    onChange={e => handleCPFChange(e.target.value)}
                                    onBlur={validateCPF}
                                />
                                {cpfStatus === 'invalid' && <p style={{ color: 'var(--neon-pink)', fontSize: '0.75rem', marginTop: '4px' }}>CPF inválido. Verifique os dígitos.</p>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Data de Nascimento *</label>
                                <input className="neon-input full-width" type="date" value={profile.nascimento} onChange={e => setProfile(p => ({ ...p, nascimento: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Telefone *</label>
                                <input className="neon-input full-width" placeholder="(11) 99999-9999" maxLength={15} value={profile.telefone} onChange={e => setProfile(p => ({ ...p, telefone: formatPhone(e.target.value) }))} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>E-mail *</label>
                                <input className="neon-input full-width" type="email" placeholder="seu@email.com" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                            </div>
                        </div>

                        {/* Photo */}
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '2px dashed rgba(0,255,255,0.25)', borderRadius: '12px', textAlign: 'center', background: 'rgba(0,255,255,0.02)' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>📸 Foto do Rosto <span style={{ color: 'var(--neon-pink)', fontSize: '0.8rem' }}>(obrigatório)</span></p>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>Envie uma foto clara do seu rosto para identificação na academia.</p>
                            {photoPreview ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                                    <img src={photoPreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--neon-cyan)', boxShadow: '0 0 20px rgba(0,255,255,0.3)' }} />
                                    <button type="button" className="neon-btn secondary small" onClick={() => setPhotoPreview(null)}>Trocar foto</button>
                                </div>
                            ) : (
                                <label className="neon-btn secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                    📂 Selecionar / Tirar Foto
                                    <input type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handlePhoto} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '15px', border: '1px solid rgba(0,255,255,0.15)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>📋 Confirmações Legais</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { key: 'terms', text: 'Li e concordo com os Termos de Uso da academia' },
                                { key: 'privacy', text: 'Li e concordo com a Política de Privacidade' },
                                { key: 'fitness', text: 'Declaro que estou apto(a) para prática de atividades físicas' },
                                { key: 'image', text: 'Autorizo o uso da minha imagem para identificação no sistema da academia' },
                            ].map(({ key, text }) => (
                                <label key={key} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', padding: '0.8rem', borderRadius: '8px', background: checks[key] ? 'rgba(0,255,255,0.05)' : 'transparent', border: `1px solid ${checks[key] ? 'rgba(0,255,255,0.2)' : 'transparent'}`, transition: 'all 0.2s' }}>
                                    <input type="checkbox" checked={checks[key]} onChange={e => setChecks(p => ({ ...p, [key]: e.target.checked }))} style={{ width: '18px', height: '18px', accentColor: 'var(--neon-cyan)', marginTop: '2px', flexShrink: 0, cursor: 'pointer' }} />
                                    <span style={{ fontSize: '0.88rem', color: checks[key] ? '#fff' : '#bbb', lineHeight: '1.4' }}>{text}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '15px', border: '1px solid rgba(0,255,255,0.15)' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>✍️ Assinatura Digital</h3>
                        <p style={{ fontSize: '0.83rem', color: '#888', marginBottom: '1.2rem' }}>Digite seu nome completo para registrar sua assinatura digital e aceitar os termos do contrato.</p>
                        <input
                            className="neon-input full-width"
                            style={{ fontSize: '1.15rem', fontFamily: 'Georgia, cursive', color: 'var(--neon-cyan)', letterSpacing: '1px' }}
                            placeholder="Seu nome completo como assinatura"
                            value={signature}
                            onChange={e => setSignature(e.target.value)}
                        />
                        {signature.trim().length >= 3 && (
                            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ✔ Assinatura registrada —  {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}
                            </div>
                        )}
                    </div>

                    {/* Payment */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '15px', border: '1px solid rgba(0,255,255,0.15)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>💳 Forma de Pagamento</h3>

                        {/* Method tabs */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            {[
                                { id: 'credit', icon: '💳', label: 'Crédito' },
                                { id: 'debit', icon: '💳', label: 'Débito' },
                                { id: 'pix', icon: '⚡', label: 'PIX' }
                            ].map(m => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setPayMethod(m.id)}
                                    style={{
                                        padding: '0.9rem',
                                        borderRadius: '10px',
                                        border: `2px solid ${payMethod === m.id ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'}`,
                                        background: payMethod === m.id ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                                        color: payMethod === m.id ? 'var(--neon-cyan)' : '#999',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {m.icon} {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Card fields */}
                        {payMethod !== 'pix' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Número do Cartão</label>
                                    <input
                                        className={`neon-input full-width${card.numero.replace(/\s/g,'').length === 16 ? ' success-input' : ''}`}
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        value={card.numero}
                                        onChange={e => setCard(c => ({ ...c, numero: formatCard(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nome no Cartão</label>
                                    <input
                                        className="neon-input full-width"
                                        placeholder="NOME COMO NO CARTÃO"
                                        value={card.nome}
                                        onChange={e => setCard(c => ({ ...c, nome: e.target.value.toUpperCase() }))}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Validade</label>
                                        <input
                                            className="neon-input full-width"
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            value={card.validade}
                                            onChange={e => setCard(c => ({ ...c, validade: formatExpiry(e.target.value) }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>CVV</label>
                                        <input
                                            className="neon-input full-width"
                                            placeholder="•••"
                                            maxLength={4}
                                            type="password"
                                            value={card.cvv}
                                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Parcelas</label>
                                        <select className="neon-input full-width" value={card.parcelas} onChange={e => setCard(c => ({ ...c, parcelas: e.target.value }))}>
                                            <option value="1">1x sem juros</option>
                                            <option value="2">2x sem juros</option>
                                            <option value="3">3x sem juros</option>
                                            <option value="6">6x + juros</option>
                                            <option value="12">12x + juros</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PIX info */}
                        {payMethod === 'pix' && (
                            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed rgba(0,255,255,0.3)', borderRadius: '12px', background: 'rgba(0,255,255,0.03)' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '0.8rem' }}>⚡</div>
                                <p style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>Pagamento via PIX</p>
                                <p style={{ color: '#888', fontSize: '0.85rem' }}>Ao finalizar, um QR Code será gerado. Escaneie com seu app bancário e o acesso é liberado imediatamente após a confirmação.</p>
                                <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'rgba(0,255,255,0.08)', borderRadius: '8px', display: 'inline-block' }}>
                                    <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--neon-cyan)' }}>extremegym@pix.banco.br</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══════════════ RIGHT (sticky) ══════════════ */}
                <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    {/* Location */}
                    <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Unidade</p>
                        <p style={{ fontWeight: 'bold' }}>🏋️ Academia Centro</p>
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Rua Exemplo, 123 – São Paulo, SP</p>
                    </div>

                    {/* Plan card */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: `2px solid ${plan.color || 'var(--neon-cyan)'}`, background: 'rgba(10,15,25,0.95)' }}>
                        <p style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Plano Selecionado</p>
                        <h3 style={{ color: plan.color || 'var(--neon-cyan)', marginBottom: '4px', fontSize: '1.3rem' }}>{plan.name}</h3>
                        <p style={{ fontSize: '0.82rem', color: '#888' }}>Acesso completo + gerador de treinos por IA ilimitados.</p>
                    </div>

                    {/* Coupon */}
                    <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <button type="button" onClick={() => setCouponOpen(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                            🎟️ Adicionar Cupom <span>{couponOpen ? '▲' : '▼'}</span>
                        </button>
                        {couponOpen && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '0.8rem' }}>
                                <input className="neon-input" placeholder="Ex: EXTREME10" value={coupon} onChange={e => setCoupon(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())} style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem' }} />
                                <button type="button" className="neon-btn small" onClick={applyCoupon}>OK</button>
                            </div>
                        )}
                        {couponMsg && <p style={{ fontSize: '0.78rem', marginTop: '6px', color: discount > 0 ? 'var(--neon-cyan)' : 'var(--neon-pink)' }}>{couponMsg}</p>}
                    </div>

                    {/* Price */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Resumo de Valores</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#ccc' }}>Mensalidade base</span>
                                <span>R$ {plan.price.toFixed(2)}</span>
                            </div>
                            {UPGRADES.filter(u => selectedUpgrades.includes(u.id)).map(u => (
                                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#aaa' }}>+ {u.title}</span>
                                    <span style={{ color: 'var(--neon-pink)' }}>R$ {u.price.toFixed(2)}</span>
                                </div>
                            ))}
                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--neon-cyan)' }}>Desconto cupom</span>
                                    <span style={{ color: 'var(--neon-cyan)' }}>- R$ {discount.toFixed(2)}</span>
                                </div>
                            )}
                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0.5rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem' }}>
                                <span>Total/mês</span>
                                <span className="glow-text-cyan">R$ {monthly.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checklist hint */}
                    <div style={{ padding: '1.2rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>Status do formulário</p>
                        {reqs.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontSize: '0.8rem', color: r.ok ? 'var(--neon-cyan)' : '#666' }}>
                                <span>{r.ok ? '✔' : '○'}</span>
                                <span>{r.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        type="submit"
                        className="neon-btn glow-pink full-width"
                        disabled={!canSubmit}
                        style={{
                            padding: '1.2rem',
                            fontSize: '1.05rem',
                            fontWeight: 'bold',
                            opacity: canSubmit ? 1 : 0.4,
                            cursor: canSubmit ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s'
                        }}
                    >
                        {canSubmit ? '🔒 CONFIRMAR PAGAMENTO' : 'Preencha todos os campos'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#666' }}>
                        🔒 Seus dados são protegidos com criptografia de ponta<br />
                        e nunca são compartilhados com terceiros.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default PlanCheckout;
