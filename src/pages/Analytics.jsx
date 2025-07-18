import React, { useState, useEffect } from 'react';
import { FaEye, FaChartLine, FaPalette, FaCalendarAlt } from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (window.analytics) {
      const dashboardStats = window.analytics.getDashboardStats();
      setStats(dashboardStats);
    }
  }, []);

  if (!stats) {
    return (
      <>
        <AdminHeader />
        <div className="analytics-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Analytics Simple</h1>
          <p>Aucune donnée disponible pour le moment.</p>
          <p><small>Les statistiques se construisent au fur et à mesure des visites.</small></p>
        </div>
      </>
    );
  }

  const currentMonth = new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <>
      <AdminHeader />
      <div className="analytics-container" style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '2rem' }}>
          📊 Analytics Simple - Site Elisabeth Constantin
        </h1>

        {/* Stats générales */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <FaEye style={{ fontSize: '2rem', color: '#3498db', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Vues Totales</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
              {stats.overview.totalViews}
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <FaPalette style={{ fontSize: '2rem', color: '#e74c3c', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Vues d'Œuvres</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
              {stats.overview.totalArtworkViews}
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <FaCalendarAlt style={{ fontSize: '2rem', color: '#27ae60', marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{currentMonth}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
              {stats.currentMonth.totalVisits}
            </div>
            <small style={{ color: '#7f8c8d' }}>visites</small>
          </div>
        </div>

        {/* Graphique visites par mois */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>
            <FaChartLine style={{ marginRight: '0.5rem' }} />
            Évolution des Visites par Mois
          </h2>
          
          {Object.keys(stats.monthly).length === 0 ? (
            <p style={{ color: '#7f8c8d', textAlign: 'center' }}>
              Pas encore assez de données pour afficher les tendances mensuelles.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(stats.monthly)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .slice(0, 6)
                .map(([month, visits]) => {
                  const maxVisits = Math.max(...Object.values(stats.monthly));
                  const percentage = maxVisits > 0 ? (visits / maxVisits) * 100 : 0;
                  
                  return (
                    <div key={month} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ minWidth: '100px', fontWeight: '500' }}>
                        {new Date(month + '-01').toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                      <div style={{ 
                        flex: 1, 
                        height: '30px', 
                        background: '#ecf0f1', 
                        borderRadius: '15px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3498db, #2980b9)',
                          borderRadius: '15px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div style={{ minWidth: '50px', fontWeight: 'bold', color: '#3498db' }}>
                        {visits}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Œuvres les plus vues */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>
            🎨 Œuvres les Plus Populaires
          </h2>
          
          {stats.topArtworks.length === 0 ? (
            <p style={{ color: '#7f8c8d', textAlign: 'center' }}>
              Aucune œuvre consultée pour le moment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.topArtworks.map((artwork, index) => {
                const maxViews = stats.topArtworks[0]?.views || 1;
                const percentage = (artwork.views / maxViews) * 100;
                
                return (
                  <div key={artwork.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    padding: '0.75rem',
                    background: index === 0 ? '#f8f9fa' : 'transparent',
                    borderRadius: '8px'
                  }}>
                    <div style={{ 
                      minWidth: '30px', 
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: index === 0 ? '#f39c12' : '#7f8c8d'
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {artwork.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                        {artwork.type === 'paint' ? 'Peinture' : 'Tableau 3D'}
                      </div>
                    </div>
                    <div style={{ 
                      minWidth: '100px',
                      height: '20px',
                      background: '#ecf0f1',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
                        borderRadius: '10px'
                      }} />
                    </div>
                    <div style={{ minWidth: '50px', fontWeight: 'bold', color: '#e74c3c' }}>
                      {artwork.views}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#ecf0f1', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
            📊 Analytics respectueuses de la vie privée - Données stockées localement
          </p>
        </div>
      </div>
    </>
  );
}
