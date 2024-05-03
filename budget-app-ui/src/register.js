import React from "react";
import { useState } from "react";

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerError, setRegisterError] = useState("");

    const onButtonClick = () => {
        if (username === "" || password === "" || confirmPassword === "") {
            setRegisterError("Please enter all fields");
            return;
        }
        
        if (password !== confirmPassword) {
            setRegisterError("Passwords do not match");
            return;
        }

        fetch ("http://localhost:8000/register", {
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
            } else if (response.status === 301) {
                const f = response.json();
                console.log(f);
                throw new Error("Error: Problem Creating Account");
            } else if (response.status === 409) {
                throw new Error("Error: Username Already Taken");
            } else {
                throw new Error("Error: Problem Creating Account");
            }
        })
        .then(data => {
            localStorage.setItem("sessionToken", data.sessionToken);
        })
        .catch(error => {
            setRegisterError(error);
        });
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
                <input className={"inputButton"} type="button" onClick={onButtonClick} value={"Register"} />
            </div>
        </div>
    );
}

export default Register;