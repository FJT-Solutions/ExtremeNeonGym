import React, { useState, useEffect } from 'react'

const Units = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [mapError, setMapError] = useState(null);
    const [closestGym, setClosestGym] = useState(null);

    const gyms = [
        { id: 1, name: "Downtown Neon", lat: -23.5505, lng: -46.6333, address: "Av. das Cores, 808", status: "Online", color: "cyan" },
        { id: 2, name: "Cyber District", lat: -23.5600, lng: -46.6500, address: "Rua do Cromo, 256", status: "Capacidade: 80%", color: "pink" },
        { id: 3, name: "Synth Valley", lat: -23.5400, lng: -46.6200, address: "Alameda Synth, 101", status: "Nova", color: "purple" }
    ];

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    findClosestGym(latitude, longitude);
                },
                (error) => {
                    setMapError("Permissão de localização negada.");
                    console.error("Error getting location:", error);
                }
            );
        } else {
            setMapError("Geolocalização não suportada.");
        }
    }, []);

    const findClosestGym = (lat, lng) => {
        let minDistance = Infinity;
        let closest = null;

        gyms.forEach(gym => {
            const distance = Math.sqrt(Math.pow(gym.lat - lat, 2) + Math.pow(gym.lng - lng, 2));
            if (distance < minDistance) {
                minDistance = distance;
                closest = gym;
            }
        });

        setClosestGym(closest);
    };

    return (
        <section id="units" className="section section-units">
            <div className="units-header">
                <h2 className="glow-text-cyan">NOSSAS UNIDADES</h2>
                <p className="units-subtitle">Encontre a ExtremeGym mais próxima de você.</p>
            </div>

            <div className="map-view-container">
                <div className="modern-map-placeholder">
                    <div className="map-grid-overlay"></div>
                    {gyms.map(gym => (
                        <div 
                            key={gym.id} 
                            className={`map-marker color-${gym.color} ${closestGym?.id === gym.id ? 'active-marker' : ''}`}
                            style={{ 
                                top: `${40 + (gym.lat + 23.55) * 600}%`, 
                                left: `${50 + (gym.lng + 46.64) * 500}%` 
                            }}
                        >
                            <div className="marker-core"></div>
                            <div className="marker-pulse"></div>
                            <div className="marker-tooltip">{gym.name}</div>
                        </div>
                    ))}
                    
                    {userLocation && (
                        <div 
                            className="user-marker"
                            style={{ 
                                top: `50%`, 
                                left: `50%` 
                            }}
                        >
                            <div className="user-icon">📍</div>
                            <span className="user-text">VOCÊ</span>
                        </div>
                    )}

                    <div className="map-controls">
                        <span className="control-btn">+</span>
                        <span className="control-btn">-</span>
                    </div>
                </div>

                <div className="units-info-list" id="units-list">
                    {gyms.map(gym => (
                        <div 
                            key={gym.id} 
                            className={`unit-card-modern neon-border-${gym.color} ${closestGym?.id === gym.id ? 'highlight' : ''}`}
                        >
                            <div className="unit-card-main">
                                <div className="unit-card-title">
                                    <span className={`status-dot ${gym.status === 'Online' ? 'active' : 'busy'}`}></span>
                                    <h3>{gym.name}</h3>
                                </div>
                                <p className="unit-address-text">{gym.address}</p>
                                <div className="unit-card-tags">
                                    <span className="tag-status">{gym.status}</span>
                                    {closestGym?.id === gym.id && <span className="tag-closest">MAIS PRÓXIMA</span>}
                                </div>
                            </div>
                            <button className="view-unit-btn">VER NO MAPA</button>
                        </div>
                    ))}
                </div>
            </div>

            {mapError && <p className="map-error-msg">{mapError}</p>}
        </section>
    );
}

export default Units

