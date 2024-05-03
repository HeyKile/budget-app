import Login from './components/login.js';
import Register from './components/register.js';
import Home from './home.js';
import useToken from './components/useToken';
import React, { useState, useEffect } from 'react';

function App() {

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

export default App;