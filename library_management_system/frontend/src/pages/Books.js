import React, { useState, useEffect } from 'react';
import { booksApi } from '../api';

const EMPTY = { title: '', author: '', category: '', isbn: '', availability_status: 'available' };

function Books() {
  const [books, setBooks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setModal]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [alert, setAlert]       = useState(null);

  const fetchBooks = () => booksApi.getAll().then(r => { setBooks(r.data); setLoading(false); });

  useEffect(() => { fetchBooks(); }, []);

  const flash = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };

  const openEdit = (b) => {
    setEditing(b.book_id);
    setForm({ title: b.title, author: b.author, category: b.category || '', isbn: b.isbn || '', availability_status: b.availability_status });
    setModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this book?')) return;
    booksApi.delete(id)
      .then(() => { flash('Book deleted.'); fetchBooks(); })
      .catch(() => flash('Failed to delete.', 'error'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editing ? booksApi.update(editing, form) : booksApi.create(form);
    action
      .then(() => { flash(editing ? 'Book updated.' : 'Book added.'); setModal(false); fetchBooks(); })
      .catch(err => flash(err.response?.data?.detail || 'Operation failed.', 'error'));
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <h1>Books</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9e9e9e', padding: 28 }}>No books found. Add one!</td></tr>
              ) : books.map(b => (
                <tr key={b.book_id}>
                  <td>{b.book_id}</td>
                  <td><strong>{b.title}</strong></td>
                  <td>{b.author}</td>
                  <td>{b.category || '—'}</td>
                  <td>{b.isbn || '—'}</td>
                  <td><span className={`badge badge-${b.availability_status}`}>{b.availability_status}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn-warning" style={{ marginRight: 8 }} onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(b.book_id)}>Delete</button>
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
            <h2>{editing ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input required value={form.title} onChange={set('title')} placeholder="Book title" />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input required value={form.author} onChange={set('author')} placeholder="Author name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input value={form.category} onChange={set('category')} placeholder="e.g. Fiction, Science" />
                </div>
                <div className="form-group">
                  <label>ISBN</label>
                  <input value={form.isbn} onChange={set('isbn')} placeholder="ISBN number" />
                </div>
              </div>
              {editing && (
                <div className="form-group">
                  <label>Availability Status</label>
                  <select value={form.availability_status} onChange={set('availability_status')}>
                    <option value="available">Available</option>
                    <option value="borrowed">Borrowed</option>
                  </select>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
