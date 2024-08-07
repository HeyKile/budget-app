import React from "react";
import { useState, createContext, useContext } from "react";
import { PropTypes } from "prop-types";

function Login({ setToken, setUser, setAuthErr }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginErr, setLoginErr] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/budget-app/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          body: JSON.stringify({ username, password })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem("access_token", data.access_token)
          setToken(data.access_token);
          localStorage.setItem("user",JSON.stringify(data.user));
          setUser(data.user);
          setUsername("");
          setPassword("");
        })
        .catch(error => {
          setAuthErr(error.message);
        });
    };

    return (
        <div>
            {loginErr !== null && <h2>{loginErr}</h2>}
            <form onSubmit={handleSubmit}>
                <label>Username:
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>Password:
                    <input
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
    setAuthErr: PropTypes.func.isRequired
};

export default Login;