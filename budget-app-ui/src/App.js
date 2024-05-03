import Login from './components/login.js';
import Register from './components/register.js';
import Home from './home.js';
import useToken from './components/useToken';
import React, { useState, useEffect } from 'react';

function App() {

  const { token, setToken } = useToken();

  if (!token) {
    return (
      <div>
        <Login setToken={setToken}/>
      </div>
    );
  }

  return (
    <div className="App">
      <Home/>
    </div>
  );
}

function LoginOrRegister({ setToken }) {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const toggleIsLoggingIn = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  return (
    <div className={"authContainer"}>
        <button onClick={toggleIsLoggingIn}>
          {isLoggingIn ? "Register" : "Login"}
        </button>
        {isLoggingIn ? <Login setToken={setToken}/> : <Register />}
    </div>
  );
}

export default App;