import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './register';
import Home from './home';
import AuthProvider from './AuthProvider';

export default function Dashboard() {

    const token = getToken();

    if (!token) {
      return <Login setToken={setToken}></Login>
    }

    return (
        <div className="App">
          <Home setToken={setToken}/>
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
  