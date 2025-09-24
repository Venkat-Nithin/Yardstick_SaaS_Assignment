import React, { useState } from 'react';
import axios from 'axios';

const InviteUserForm = ({ token, onUserInvited }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/invite`, { email, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      onUserInvited();
      setEmail('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to invite user.');
      }
    }
  };

  return (
    <div>
      <h3>Invite New User</h3>
      <form onSubmit={handleInvite}>
        <div>
          <label htmlFor="invite-email">Email:</label>
          <input
            type="email"
            id="invite-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="invite-role">Role:</label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">Invite</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default InviteUserForm;