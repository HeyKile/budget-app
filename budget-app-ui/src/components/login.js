import React from "react";
import { useState } from "react";
import { PropTypes } from "prop-types";

export default function Login ({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const onButtonClick = async () => {
        setLoginError("");

        if (username === "" || password === "") {
            setLoginError("Please enter a username and password");
            return;
        }

        let result = await loginUser(username, password);
        if (result === -1) {
            setLoginError("Error: Invalid Credentials")
            return;
        }
        setToken(result.token);
        
    }

    return (
        <div className={"loginContainer"}>
            <div className={"inputContainer"}>
                <input
                    value={username}
                    placeholder="Username"
                    onChange={(un) => setUsername(un.target.value)}
                    className={"inputBox"}
                />
                <input
                    value={password}
                    placeholder="Password"
                    onChange={(pw) => setPassword(pw.target.value)}
                    className={"inputBox"}
                />
                <div className={"inputContainer"}>
                    <label className="errorLabel">{loginError}</label>
                </div>
            </div>
            <div className={"inputContainer"}>
                <input className={'inputButton'} type="button" onClick={onButtonClick} value={"Log in"} />
            </div>
        </div>
    );
}

// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
// };

async function loginUser(username, password) {
    return fetch ("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
            })
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return -1;
            }
        });
}