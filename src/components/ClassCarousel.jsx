import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { classService } from '../services/classCatalog';

const ClassCarousel = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const catalog = classService.getCatalog();
        setClasses(catalog.filter(c => c.status === 'ativa'));
    }, []);

    if (classes.length === 0) return null;

    return (
        <section id="classes" className="section classes-carousel-section">
            <div className="carousel-header">
                <h2 className="glow-text-white">O TREINO QUE VOCÊ PROCURA, AQUI TEM.</h2>
                <p className="carousel-subtitle">*Verifique a disponibilidade na unidade de sua preferência.</p>
            </div>

            <div className="carousel-container">
                <Swiper
                    modules={[Navigation]}
                    centeredSlides={true}
                    loop={true}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.nav-btn-prev',
                        nextEl: '.nav-btn-next',
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="class-swiper"
                >
                    {classes.map((cls) => (
                        <SwiperSlide key={cls.id}>
                            {({ isActive }) => (
                                <div 
                                    className={`class-card ${isActive ? 'active' : 'blurred'}`}
                                    onClick={() => setSelectedClass(cls)}
                                >
                                    <div 
                                        className="card-bg" 
                                        style={{ backgroundImage: `url(${cls.image_url})` }}
                                    ></div>
                                    <div className="card-overlay"></div>
                                    <div className="card-content">
                                        <div className="class-category">{cls.category}</div>
                                        <h3 className="class-title">{cls.name}</h3>
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="carousel-nav">
                    <button className="nav-btn-prev">←</button>
                    <button className="nav-btn-next">→</button>
                </div>
            </div>

            {selectedClass && (
                <div className="modal-overlay" onClick={() => setSelectedClass(null)}>
                    <div className="modal-content class-detail-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedClass(null)}>&times;</button>
                        <div className="modal-grid">
                            <div className="modal-image" style={{ backgroundImage: `url(${selectedClass.image_url})` }}></div>
                            <div className="modal-info">
                                <h2 className="glow-text-cyan">{selectedClass.name}</h2>
                                <p className="class-desc">{selectedClass.description}</p>
                                <div className="class-metadata">
                                    <p><strong>📅 Horário:</strong> {selectedClass.schedule}</p>
                                    <p><strong>👤 Instrutor:</strong> {selectedClass.instructor}</p>
                                </div>
                                <button className="neon-btn glow-cyan full-width" onClick={() => {
                                    alert('Reserva confirmada! Você receberá um e-mail com os detalhes.');
                                    setSelectedClass(null);
                                }}>
                                    Participar da aula
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ClassCarousel;
