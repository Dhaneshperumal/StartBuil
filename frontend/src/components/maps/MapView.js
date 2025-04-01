import React, { useEffect, useRef, useState } from 'react';
import { getMapConfig } from '../../services/api';
import { initializeMap, addTileLayer } from '../../services/map';
import '../../cssStyles/maps/mapview.css';

const MapView = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // Store map instance
  const [mapConfig, setMapConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLayer, setActiveLayer] = useState('standard');
  
  // Handle layer change
  const handleLayerChange = (layerType) => {
    if (mapRef.current) {
      addTileLayer(mapRef.current, layerType);
      setActiveLayer(layerType);
    }
  };

  // Initialize map after component mounts
  useEffect(() => {
    // Ensure the container exists
    if (!mapContainerRef.current) return;

    const setupMap = async () => {
      try {
        setLoading(true);
        
        // 1. Get map configuration
        const config = await getMapConfig();
        setMapConfig(config);
        
        // 2. Initialize map only after container is rendered
        const mapInstance = await initializeMap(mapContainerRef.current, {
          center: config.defaultCenter || [39.6365, -79.9545],
          zoom: config.defaultZoom || 15,
          maxZoom: config.maxZoom || 19,
          minZoom: config.minZoom || 12
        });
        
        // 3. Add tile layer
        addTileLayer(mapInstance, activeLayer);
        
        // Store map instance
        mapRef.current = mapInstance;
        setLoading(false);
        
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to load map. Please try again.');
        setLoading(false);
      }
    };

    setupMap();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>
          <i className="fas fa-map-marked-alt me-2"></i>
          City Map
        </h1>
        <p className="lead">Explore Smart City with interactive maps</p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="map-loading">
          <div className="spinner-border text-primary" role="status">
            {/* <span className="visually-hidden">Loading map...</span> */}
          </div>
          <p>Loading map...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Map Controls */}
      {!loading && !error && (
        <>
          <div className="map-controls">
            <div className="layer-controls">
              <label>Map Layers:</label>
              <div className="btn-group" role="group">
                <button 
                  type="button" 
                  className={`btn btn-sm ${activeLayer === 'standard' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleLayerChange('standard')}
                >
                  Default
                </button>
                <button 
                  type="button" 
                  className={`btn btn-sm ${activeLayer === 'satellite' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleLayerChange('satellite')}
                >
                  Satellite
                </button>
                <button 
                  type="button" 
                  className={`btn btn-sm ${activeLayer === 'terrain' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleLayerChange('terrain')}
                >
                  Terrain
                </button>
              </div>
            </div>
            
            <div className="map-legend">
              <button className="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#mapLegend">
                <i className="fas fa-info-circle me-1"></i> Legend
              </button>
              <div className="collapse" id="mapLegend">
                <div className="card card-body legend-card">
                  <h5>Map Symbols</h5>
                  <ul className="legend-list">
                    <li><i className="fas fa-building text-primary"></i> Attractions</li>
                    <li><i className="fas fa-utensils text-success"></i> Dining</li>
                    <li><i className="fas fa-shopping-bag text-danger"></i> Shopping</li>
                    <li><i className="fas fa-subway text-warning"></i> Transportation</li>
                    <li><i className="fas fa-calendar-alt text-info"></i> Events</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div 
            ref={mapContainerRef} 
            id="mapContainer"
            className="map-view"
            style={{ 
              height: '600px', 
              width: '100%'
            }}
          />
          
          {/* Offline Maps Notice */}
          <div className="offline-maps-notice">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Offline Maps</h5>
                <p className="card-text">Download maps for offline use when you're on the go.</p>
                <button className="btn btn-primary">Download Maps</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;