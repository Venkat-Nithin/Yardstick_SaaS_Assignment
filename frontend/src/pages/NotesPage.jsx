import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InviteUserForm from '../components/InviteUserForm'; // Import the new component

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [tenant, setTenant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // New state for role
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotes();
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setTenant(userData.tenant);
      setIsAdmin(userData.role === 'Admin'); // Set isAdmin state
    }
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate('/');
      }
      setError('Failed to fetch notes.');
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError('');

    if (tenant && tenant.subscriptionPlan === 'Free' && notes.length >= 3) {
      setError('Free plan limit reached. Upgrade to Pro for unlimited notes.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/notes`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create note.');
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note.');
    }
  };

  const handleUpgrade = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'Admin') {
      setError('Only Admin users can upgrade subscriptions.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tenants/${userData.tenant.slug}/upgrade`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUserData = { ...userData, tenant: { ...userData.tenant, subscriptionPlan: 'Pro' } };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setTenant(updatedUserData.tenant);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to upgrade subscription.');
      }
    }
  };

  const onUserInvited = () => {
      console.log('User invited. Check the database for the new user.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Notes Dashboard</h2>
        {tenant && (
          <div>
            <h3>Tenant: {tenant.name}</h3>
            <p>Plan: {tenant.subscriptionPlan}</p>
            {tenant.subscriptionPlan === 'Free' && (
              <button onClick={handleUpgrade} disabled={!isAdmin}>
                {isAdmin ? 'Upgrade to Pro' : 'Upgrade (Admin Only)'}
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Create New Note</h3>
      <form onSubmit={handleCreateNote}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Create Note</button>
      </form>

      <h3>Your Notes</h3>
      {notes.length === 0 ? (
        <p>You have no notes. Create one above!</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* New invite user form */}
      {isAdmin && (
          <InviteUserForm token={token} onUserInvited={onUserInvited} />
      )}
    </div>
  );
};

export default NotesPage;