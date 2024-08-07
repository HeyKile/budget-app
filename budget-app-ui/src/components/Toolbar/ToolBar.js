import React, { useState, useEffect, useContext } from "react";
import UserTokenContext from "../Contexts/UserTokenContext";
import Logout from "./Logout";

function ToolBar({ setToken, setUser }) {

    const token = useContext(UserTokenContext);

    return (
        <div>
            <Logout setToken={setToken} setUser={setUser}/>
        </div>
    );

}

export default ToolBar;