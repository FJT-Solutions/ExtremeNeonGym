import React from 'react'

const Gallery = () => (
    <section id="gallery" className="section">
        <h2 className="glow-text-purple">Galeria Neon</h2>
        <div className="mosaic-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="mosaic-item neon-border-pink">
                    <img src={`https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400&sig=${i}`} alt="Gallery" />
                </div>
            ))}
        </div>
    </section>
)

export default Gallery
