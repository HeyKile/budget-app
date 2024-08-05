import React, { useState, useContext } from "react"

function Register({ setRegistering }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords Don't Match!");
            return;
        }
        fetch('http://localhost:5000/budget-app/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.status === 409) {
                throw new Error("Username Already Taken!");
            } else if (response.status === 400) {
                throw new Error("Username and Password Required");
            } else if (!response.ok) {
                throw new Error("There was a problem registering the account");
            } else {
                return response.json();
            }
        })
        .then(() => {
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setRegistering(false);
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Username:
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                {error !== "" && <h3>Error: {error}</h3>}
                <label>Password:
                    <input
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>Re-enter Password: 
                    <input
                        type="password"
                        value={confirmPassword}
                        autoComplete="off"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
        </form>
    );

}

export default Register;