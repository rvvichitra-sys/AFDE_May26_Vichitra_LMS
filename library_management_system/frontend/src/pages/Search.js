import React, { useState } from 'react';
import { searchApi } from '../api';

function Search() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    searchApi
      .search(query.trim())
      .then(res => { setResults(res.data); setSearched(true); setLoading(false); })
      .catch(() => { setResults([]); setSearched(true); setLoading(false); });
  };

  return (
    <div>
      <div className="page-header"><h1>Search Books</h1></div>

      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, author, category, or ISBN..."
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 0 }}>
            Search
          </button>
        </form>
      </div>

      {loading && <div className="loading">Searching...</div>}

      {searched && !loading && (
        <>
          <p style={{ marginBottom: 12, color: '#757575', fontSize: 14 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} found for <em>"{query}"</em>
          </p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9e9e9e', padding: 28 }}>No books match your search.</td></tr>
                ) : results.map(b => (
                  <tr key={b.book_id}>
                    <td>{b.book_id}</td>
                    <td><strong>{b.title}</strong></td>
                    <td>{b.author}</td>
                    <td>{b.category || '—'}</td>
                    <td>{b.isbn || '—'}</td>
                    <td><span className={`badge badge-${b.availability_status}`}>{b.availability_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!searched && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#bdbdbd' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p>Enter a search term above to find books.</p>
        </div>
      )}
    </div>
  );
}

export default Search;
