import React from "react";
import { useState } from "react";
import { PropTypes } from "prop-types";

const errorText = {
    FIELDS_UNFILLED: "Please enter all fields",
    PASSWORDS_DIFFERENT: "Passwords do not match",
    USERNAME_TAKEN: "Error: Username Already Taken",
    SERVER_ERROR: "Error: Username Already Taken",
};

export default function Register( {setHasRegistered} ) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerError, setRegisterError] = useState("");

    const handleRegister = async () => {
        if (username === "" || password === "" || confirmPassword === "") {
            // setRegisterError("Please enter all fields");
            setRegisterError(errorText.FIELDS_UNFILLED);
            return;
        }
        
        if (password !== confirmPassword) {
            setRegisterError(errorText.PASSWORDS_DIFFERENT);
            return;
        }

        const result = await registerUser(username, password);
        if (result !== 0) {
            setRegisterError(result);
            return
        }
        setHasRegistered(true);
    };

    return (
        <div className={"inputContainer"}>
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
                <input
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(cpw) => setConfirmPassword(cpw.target.value)}
                    className={"inputBox"}
                />
                <div className={"inputContainer"}>
                    <label className="errorLabel">{registerError}</label>
                </div>
            </div>
            <div className={"inputContainer"}>
                <input className={"inputButton"} type="button" onClick={handleRegister} value={"Register"} />
            </div>
        </div>
    );
}

async function registerUser(username, password) {
    return fetch ("http://localhost:8000/register", {
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
                return 0
            } else if (response.status === 409) {
                return errorText.USERNAME_TAKEN
            } else {
                return errorText.SERVER_ERROR
            }
        })
}