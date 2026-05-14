import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api';
import './Dashboard.css';

function StatCard({ value, label, colorClass }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load dashboard. Is the backend running?'); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error)   return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>

      <div className="stats-grid">
        <StatCard value={stats.total_books}     label="Total Books"      colorClass="blue"   />
        <StatCard value={stats.available_books} label="Available Books"  colorClass="green"  />
        <StatCard value={stats.borrowed_books}  label="Borrowed Books"   colorClass="orange" />
        <StatCard value={stats.total_borrowers} label="Total Borrowers"  colorClass="purple" />
      </div>

      <div className="card" style={{ marginTop: 28 }}>
        <h2 style={{ marginBottom: 16, color: '#1a237e', fontSize: 18 }}>Recent Transactions</h2>
        {stats.recent_transactions.length === 0 ? (
          <p style={{ color: '#9e9e9e' }}>No transactions recorded yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_transactions.map(t => (
                  <tr key={t.transaction_id}>
                    <td>{t.transaction_id}</td>
                    <td>{t.book_title}</td>
                    <td>{t.borrower_name}</td>
                    <td>{new Date(t.borrow_date).toLocaleDateString()}</td>
                    <td>{t.return_date ? new Date(t.return_date).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${t.return_date ? 'badge-available' : 'badge-borrowed'}`}>
                        {t.return_date ? 'Returned' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
