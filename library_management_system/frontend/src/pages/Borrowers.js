import React, { useState, useEffect } from 'react';
import { borrowersApi } from '../api';

const EMPTY = { borrower_name: '', email: '', phone: '' };

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setModal]     = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [alert, setAlert]         = useState(null);

  const fetchBorrowers = () => borrowersApi.getAll().then(r => { setBorrowers(r.data); setLoading(false); });

  useEffect(() => { fetchBorrowers(); }, []);

  const flash = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };

  const openEdit = (b) => {
    setEditing(b.borrower_id);
    setForm({ borrower_name: b.borrower_name, email: b.email || '', phone: b.phone || '' });
    setModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this borrower?')) return;
    borrowersApi.delete(id)
      .then(() => { flash('Borrower deleted.'); fetchBorrowers(); })
      .catch(() => flash('Failed to delete.', 'error'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editing ? borrowersApi.update(editing, form) : borrowersApi.create(form);
    action
      .then(() => { flash(editing ? 'Borrower updated.' : 'Borrower added.'); setModal(false); fetchBorrowers(); })
      .catch(err => flash(err.response?.data?.detail || 'Operation failed.', 'error'));
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <h1>Borrowers</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Borrower</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {loading ? (
        <div className="loading">Loading borrowers...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#9e9e9e', padding: 28 }}>No borrowers found. Add one!</td></tr>
              ) : borrowers.map(b => (
                <tr key={b.borrower_id}>
                  <td>{b.borrower_id}</td>
                  <td><strong>{b.borrower_name}</strong></td>
                  <td>{b.email || '—'}</td>
                  <td>{b.phone || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn-warning" style={{ marginRight: 8 }} onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(b.borrower_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h2>{editing ? 'Edit Borrower' : 'Add New Borrower'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input required value={form.borrower_name} onChange={set('borrower_name')} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phone} onChange={set('phone')} placeholder="e.g. +91 9876543210" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add Borrower'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Borrowers;
