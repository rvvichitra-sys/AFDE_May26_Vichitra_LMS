import React, { useState, useEffect } from 'react';
import { booksApi, borrowersApi, transactionsApi } from '../api';

function BorrowReturn() {
  const [books, setBooksData]     = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [transactions, setTxns]   = useState([]);
  const [borrowForm, setBForm]    = useState({ book_id: '', borrower_id: '' });
  const [returnId, setReturnId]   = useState('');
  const [alert, setAlert]         = useState(null);
  const [activeTab, setActiveTab] = useState('borrow');

  const fetchAll = () =>
    Promise.all([booksApi.getAll(), borrowersApi.getAll(), transactionsApi.getAll()])
      .then(([b, br, t]) => { setBooksData(b.data); setBorrowers(br.data); setTxns(t.data); });

  useEffect(() => { fetchAll(); }, []);

  const flash = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleBorrow = (e) => {
    e.preventDefault();
    transactionsApi.borrow({ book_id: +borrowForm.book_id, borrower_id: +borrowForm.borrower_id })
      .then(() => { flash('Book borrowed successfully!'); setBForm({ book_id: '', borrower_id: '' }); fetchAll(); })
      .catch(err => flash(err.response?.data?.detail || 'Failed to borrow book.', 'error'));
  };

  const handleReturn = (e) => {
    e.preventDefault();
    transactionsApi.return({ book_id: +returnId })
      .then(() => { flash('Book returned successfully!'); setReturnId(''); fetchAll(); })
      .catch(err => flash(err.response?.data?.detail || 'Failed to return book.', 'error'));
  };

  const available = books.filter(b => b.availability_status === 'available');
  const borrowed  = books.filter(b => b.availability_status === 'borrowed');

  const tabs = ['borrow', 'return', 'transactions'];

  return (
    <div>
      <div className="page-header"><h1>Borrow / Return</h1></div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="tabs">
        {tabs.map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'borrow' && (
        <div className="card">
          <h2 style={{ marginBottom: 20, color: '#1a237e', fontSize: 18 }}>Borrow a Book</h2>
          {available.length === 0 ? (
            <p style={{ color: '#9e9e9e' }}>No books are currently available to borrow.</p>
          ) : (
            <form onSubmit={handleBorrow} style={{ maxWidth: 480 }}>
              <div className="form-group">
                <label>Select Book *</label>
                <select required value={borrowForm.book_id} onChange={e => setBForm(f => ({ ...f, book_id: e.target.value }))}>
                  <option value="">— Choose an available book —</option>
                  {available.map(b => (
                    <option key={b.book_id} value={b.book_id}>
                      {b.title} — {b.author}{b.isbn ? ` (${b.isbn})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Borrower *</label>
                <select required value={borrowForm.borrower_id} onChange={e => setBForm(f => ({ ...f, borrower_id: e.target.value }))}>
                  <option value="">— Choose a borrower —</option>
                  {borrowers.map(b => (
                    <option key={b.borrower_id} value={b.borrower_id}>
                      {b.borrower_name}{b.email ? ` (${b.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Confirm Borrow</button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'return' && (
        <div className="card">
          <h2 style={{ marginBottom: 20, color: '#1a237e', fontSize: 18 }}>Return a Book</h2>
          {borrowed.length === 0 ? (
            <p style={{ color: '#9e9e9e' }}>No books are currently borrowed.</p>
          ) : (
            <form onSubmit={handleReturn} style={{ maxWidth: 480 }}>
              <div className="form-group">
                <label>Select Borrowed Book *</label>
                <select required value={returnId} onChange={e => setReturnId(e.target.value)}>
                  <option value="">— Choose a borrowed book —</option>
                  {borrowed.map(b => (
                    <option key={b.book_id} value={b.book_id}>
                      {b.title} — {b.author}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Confirm Return</button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Book</th><th>Borrower</th><th>Borrow Date</th><th>Return Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9e9e9e', padding: 28 }}>No transactions yet.</td></tr>
              ) : transactions.map(t => (
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
  );
}

export default BorrowReturn;
