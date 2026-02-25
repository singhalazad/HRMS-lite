import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Users, UserCheck, UserX } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    date: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async (dateParam) => {
    setLoading(true);
    try {
      const response = await getDashboardStats({ date: dateParam });
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading && Object.keys(stats).length === 0) return <div className="loading-state">Loading dashboard metrics...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Dashboard</h1>
        <div className="date-picker-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="dashboard-date" style={{ fontWeight: 500 }}>Select Date:</label>
          <input 
            type="date" 
            id="dashboard-date"
            value={selectedDate} 
            onChange={handleDateChange}
            className="date-input"
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
        </div>
      </div>
      {error && <div className="error-state">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Users className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Employees</p>
            <h3 className="stat-value">{stats.total_employees}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <UserCheck className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Present Today</p>
            <h3 className="stat-value">{stats.present_today}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <UserX className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Absent Today</p>
            <h3 className="stat-value">{stats.absent_today}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
