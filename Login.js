import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onLogin(username.trim());
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Enter your username</h2>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}

export default Login;