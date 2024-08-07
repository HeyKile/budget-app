import React, { useState, useContext } from "react"
import { UserTokenContext } from "../Contexts";

function Logout({ setToken, setUser }) {
    const token = useContext(UserTokenContext);

    const logoutHandler = async () => {
        fetch("http://localhost:5000/budget-app/api/users/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
                "Authorization": `Bearer ${token}`
            }
        })
        .catch((error) => {
            console.error(error); 
        })
        .finally(() => {
            setToken(null); 
            localStorage.removeItem("access_token");
            setUser(null);
            localStorage.removeItem("user");
        });
    }; 

    return (
        <button onClick={logoutHandler}>Logout</button>
    );
}

export default Logout;