import Login from './login.js';
import Register from './register.js';
import Home from './home.js';
import React, { useState, useEffect } from 'react';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? <Home /> : <LoginOrRegister />}
    </div>
  );
}

function LoginOrRegister() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const toggleIsLoggingIn = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  return (
    <div className={"authContainer"}>
        <button onClick={toggleIsLoggingIn}>
          {isLoggingIn ? 'Register' : 'Login'}
        </button>
        {isLoggingIn ? <Login /> : <Register />}
    </div>
  );
}

export default App;
