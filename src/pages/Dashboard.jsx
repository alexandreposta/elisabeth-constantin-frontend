import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaShoppingCart, FaPalette, FaCalendarAlt, 
  FaEuroSign, FaChartLine, FaSignOutAlt, FaUser,
  FaCog, FaPlus, FaEye, FaEdit
} from 'react-icons/fa';
import { AuthService } from '../api/auth';
import AdminHeader from '../components/AdminHeader';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification de manière asynchrone
    const checkAuthAndLoadData = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
          navigate('/admin/login');
          return;
        }

        // Si authentifié, charger les données
        loadDashboardData();
        loadAnalyticsData();
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        navigate('/admin/login');
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const loadAnalyticsData = () => {
    if (window.analytics) {
      const analyticsData = window.analytics.getDashboardStats();
      setAnalyticsStats(analyticsData);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(''); // Réinitialiser l'erreur
      
      // Charger les données séparément pour éviter qu'une erreur bloque tout
      const statsPromise = AuthService.getDashboardStats().catch(err => {
        console.warn('Erreur stats dashboard:', err);
        return null; // Retourner null en cas d'erreur
      });
      
      const adminPromise = AuthService.getCurrentAdmin().catch(err => {
        console.warn('Erreur données admin:', err);
        return null;
      });
      
      const [statsData, adminData] = await Promise.all([statsPromise, adminPromise]);
      
      // Définir les stats même si elles sont nulles
      if (statsData) {
        setStats(statsData);
        
        // Afficher un message si les données contiennent une erreur
        if (statsData.error) {
          setError(`Données partielles: ${statsData.errorMessage}`);
        }
      } else {
        // Définir des données par défaut
        setStats({
          sales: { daily_sales: [], popular_artworks: [], monthly_trends: [] },
          inventory: { artwork_types: [], price_ranges: [] },
          performance: { conversion_data: { total_artworks: 0, total_orders: 0, conversion_rate: 0 }, avg_days_between_orders: 0 },
          last_updated: new Date().toISOString()
        });
        setError('Impossible de charger les statistiques. Données par défaut affichées.');
      }
      
      if (adminData) {
        setAdmin(adminData);
      }

      // Charger les analytics si disponibles
      if (window.analytics) {
        try {
          const analytics = window.analytics.getDashboardStats();
          setAnalyticsStats(analytics);
        } catch (analyticsErr) {
          console.warn('Erreur analytics:', analyticsErr);
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur générale dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  const navigateToAdmin = (path) => {
    navigate(path);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      paid: '#2ecc71',
      shipped: '#3498db',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      paid: 'Payée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={loadDashboardData}>Réessayer</button>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-title">
            <h1>Dashboard Administrateur</h1>
          </div>
        <div className="dashboard-actions">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.total_orders || 0}</div>
            <div className="stat-label">Commandes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaEuroSign />
          </div>
          <div className="stat-content">
            <div className="stat-number">{formatCurrency(stats?.total_revenue || 0)}</div>
            <div className="stat-label">Chiffre d'Affaires</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon newsletter">
            <FaUsers />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.newsletter_subscribers || 0}</div>
            <div className="stat-label">Abonnés Newsletter</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon artworks">
            <FaPalette />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.available_artworks || 0}/{stats?.total_artworks || 0}</div>
            <div className="stat-label">Œuvres Disponibles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon events">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats?.active_events || 0}/{stats?.total_events || 0}</div>
            <div className="stat-label">Événements Actifs</div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analyticsStats && (
          <>
            <div className="stat-card">
              <div className="stat-icon analytics">
                <FaEye />
              </div>
              <div className="stat-content">
                <div className="stat-number">{analyticsStats.overview.totalConnections}</div>
                <div className="stat-label">Connexions Site</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon artworks">
                <FaPalette />
              </div>
              <div className="stat-content">
                <div className="stat-number">{analyticsStats.overview.totalArtworkViews}</div>
                <div className="stat-label">Vues d'Œuvres</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h2>Statuts des Commandes</h2>
          <div className="orders-status-chart">
            {stats?.order_stats && Object.entries(stats.order_stats).map(([status, count]) => (
              <div key={status} className="status-bar">
                <div className="status-info">
                  <span className="status-label">{getStatusLabel(status)}</span>
                  <span className="status-count">{count}</span>
                </div>
                <div className="status-progress">
                  <div 
                    className="status-fill" 
                    style={{ 
                      width: `${(count / stats.total_orders) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h2>Revenus Mensuels</h2>
          <div className="revenue-chart">
            {stats?.monthly_revenue && Object.entries(stats.monthly_revenue).map(([month, revenue]) => (
              <div key={month} className="revenue-bar">
                <div className="revenue-info">
                  <span className="revenue-month">{month}</span>
                  <span className="revenue-amount">{formatCurrency(revenue)}</span>
                </div>
                <div className="revenue-progress">
                  <div 
                    className="revenue-fill"
                    style={{ 
                      width: `${(revenue / Math.max(...Object.values(stats.monthly_revenue))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {analyticsStats && (
        <div className="analytics-section">
          <h2 style={{ color: '#2c3e50', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartLine />
            Analytics du Site
          </h2>
          
          <div className="charts-section">
            {/* Connexions mensuelles */}
            <div className="chart-container">
              <h3>Connexions Mensuelles au Site</h3>
              <div className="analytics-chart">
                {Object.keys(analyticsStats.monthly).length === 0 ? (
                  <p style={{ color: '#7f8c8d', textAlign: 'center' }}>
                    Pas encore assez de données pour afficher les tendances mensuelles.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(analyticsStats.monthly)
                      .sort(([a], [b]) => new Date(b) - new Date(a))
                      .slice(0, 6)
                      .map(([month, connections]) => {
                        const maxConnections = Math.max(...Object.values(analyticsStats.monthly));
                        const percentage = maxConnections > 0 ? (connections / maxConnections) * 100 : 0;
                        
                        return (
                          <div key={month} className="status-bar">
                            <div className="status-info">
                              <span className="status-label">
                                {new Date(month + '-01').toLocaleDateString('fr-FR', { 
                                  year: 'numeric', 
                                  month: 'long' 
                                })}
                              </span>
                              <span className="status-count">{connections}</span>
                            </div>
                            <div className="status-progress">
                              <div 
                                className="status-fill" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: '#3498db'
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Œuvres populaires */}
            <div className="chart-container">
              <h3>Œuvres les Plus Consultées</h3>
              <div className="popular-artworks-chart">
                {analyticsStats.topArtworks.length === 0 ? (
                  <p style={{ color: '#7f8c8d', textAlign: 'center' }}>
                    Aucune œuvre consultée pour le moment.
                  </p>
                ) : (
                  analyticsStats.topArtworks.map((artwork, index) => {
                    const maxViews = analyticsStats.topArtworks[0]?.views || 1;
                    const percentage = (artwork.views / maxViews) * 100;
                    
                    return (
                      <div key={artwork.id} className="artwork-bar">
                        <div className="artwork-info">
                          <div className="artwork-title">#{index + 1} {artwork.title}</div>
                          <div className="artwork-sales">
                            {artwork.type === 'paint' ? 'Peinture' : 'Tableau 3D'}
                          </div>
                        </div>
                        <div className="artwork-progress">
                          <div 
                            className="artwork-fill"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: '#e74c3c'
                            }}
                          ></div>
                        </div>
                        <div style={{ minWidth: '50px', fontWeight: 'bold', color: '#e74c3c' }}>
                          {artwork.views}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Stats du mois en cours */}
          <div className="current-month-stats" style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
              📊 Ce mois-ci ({new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })})
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
                  {analyticsStats.currentMonth.totalConnections}
                </div>
                <div style={{ color: '#7f8c8d' }}>Connexions uniques</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                  {analyticsStats.currentMonth.artworkViews}
                </div>
                <div style={{ color: '#7f8c8d' }}>Vues d'œuvres</div>
              </div>
            </div>
          </div>

          <div style={{ 
            marginTop: '1rem', 
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
      )}

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Activité Récente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <FaShoppingCart />
            </div>
            <div className="activity-content">
              <p>Nouvelle commande reçue</p>
              <span className="activity-time">Il y a 2 heures</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <FaPalette />
            </div>
            <div className="activity-content">
              <p>Œuvre ajoutée à la galerie</p>
              <span className="activity-time">Il y a 1 jour</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <FaCalendarAlt />
            </div>
            <div className="activity-content">
              <p>Nouvel événement programmé</p>
              <span className="activity-time">Il y a 3 jours</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
