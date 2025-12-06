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
      console.log("Fetching decks with token:", token);
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
    return <div className="page-container">Loading decks...</div>;
  }

  return (
    <div className="page-container dashboard">
      <h1>Your Decks</h1>
      <section className="deck-list">
        {error && <p className="error-message">{error}</p>}
        <div className="decks-grid">
          {decks.map((deck) => (
            <div key={deck.id} className="deck-card">
              <h2>{deck.title}</h2>
              <p>{deck.description}</p>
              <p className="deck-created-at">Created: {new Date(deck.created_at).toLocaleDateString()}</p>
              <div className="deck-actions">
                <Link to={`/deck/${deck.id}`} className="button primary">View Cards</Link>
                <Link to={`/deck/${deck.id}/study`} className="button secondary">Study</Link>
                <button onClick={() => handleDelete(deck.id)} className="button danger">Delete</button>
              </div>
            </div>
          ))}
          <Link to="/create-deck" className="deck-card new-deck-card">
            <h2>+ Create New Deck</h2>
            <p>Start building your knowledge base.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
