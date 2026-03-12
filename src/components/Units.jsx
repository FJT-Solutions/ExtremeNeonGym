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
            <h2 className="glow-text-cyan">Unidades</h2>
            <div className="radar-container glass-section">
                <div className="map-container">
                    {/* Simulated Google Maps Component */}
                    <div className="map-placeholder-text">
                        {userLocation ? (
                            <div className="map-info fade-in">
                                <p className="glow-text-cyan">Mapa Carregado</p>
                                <p className="small-detail">Sua posição: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                                {closestGym && (
                                    <p className="glow-text-pink" style={{ marginTop: '10px' }}>
                                        Sugerida: {closestGym.name} (A mais próxima!)
                                    </p>
                                )}
                            </div>
                        ) : mapError ? (
                            <p className="error-text">{mapError}</p>
                        ) : (
                            <p>Solicitando permissão de GPS...</p>
                        )}
                    </div>
                </div>
                <div className="units-list">
                    {gyms.map(gym => (
                        <div key={gym.id} className={`unit-item neon-border-${gym.color} ${closestGym?.id === gym.id ? 'highlight-unit' : ''}`}>
                            <h3>{gym.name}</h3>
                            <p>{gym.address}</p>
                            <span className="status">{gym.status}</span>
                            {closestGym?.id === gym.id && <span className="closest-tag">MAIS PRÓXIMA</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Units

