import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/decks/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDecks(response.data);
      } catch (err) {
        setError('Failed to fetch decks.');
        console.error('Fetch decks error:', err);
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDecks();
    }
  }, [token, logout]);

  const handleDelete = async (deckId) => {
    try {
      await axios.delete(`http://localhost:8000/decks/${deckId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDecks(decks.filter((deck) => deck.id !== deckId));
    } catch (err) {
      setError('Failed to delete deck.');
      console.error('Delete deck error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  if (loading) {
    return <div>Loading decks...</div>;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Your Decks</h1>
        <button onClick={logout} className="button secondary">Logout</button>
      </header>
      <section className="deck-list">
        {error && <p className="error-message">{error}</p>}
        {decks.length === 0 ? (
          <p>No decks yet. <Link to="/create-deck">Create one!</Link></p>
        ) : (
          <div className="decks-grid">
            {decks.map((deck) => (
              <div key={deck.id} className="deck-card">
                <h2>{deck.title}</h2>
                <p>{deck.description}</p>
                <div className="deck-actions">
                  <Link to={`/deck/${deck.id}`} className="button primary">View Cards</Link>
                  <Link to={`/deck/${deck.id}/study`} className="button secondary">Study</Link>
                  <button onClick={() => handleDelete(deck.id)} className="button danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="create-deck-section">
        <Link to="/create-deck" className="button primary">Create New Deck</Link>
      </div>
    </div>
  );
};

export default Dashboard;
