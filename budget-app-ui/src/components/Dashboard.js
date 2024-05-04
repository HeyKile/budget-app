import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './register';
import Home from '../home';

export default function Dashboard() {

    const [token, setToken] = useState();

    return (
        <div className="App">
          {!token ? <LoginOrRegister setToken={setToken}/> : <Home setToken={setToken}/>}
        </div>
      );

}

function LoginOrRegister({ setToken }) {

    const [isLoggingIn, setIsLoggingIn] = useState(true);
    const [hasRegistered, setHasRegistered] = useState(false);
  
    const toggleIsLoggingIn = () => {
      setIsLoggingIn(!isLoggingIn);
    };
  
    return (
      <div className={"authContainer"}>
          <button onClick={toggleIsLoggingIn}>
            {isLoggingIn ? "Register" : "Login"}
          </button>
          {isLoggingIn || hasRegistered ? <Login setToken={setToken}/> : <Register setHasRegistered={setHasRegistered}/>}
      </div>
    );
  }
  