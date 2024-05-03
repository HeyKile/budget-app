import Login from './components/login.js';
import Register from './components/register.js';
import Home from './home.js';
import React, { useState, useEffect } from 'react';

function App() {

  const [token, setToken] = useState();
  // useEffect(() => {
  //   const token = localStorage.getItem("sessionToken");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  return (
    <div className="App">
      {isLoggedIn ? <Home/> : <LoginOrRegister setToken={token}/>}
    </div>
  );
}

function LoginOrRegister({ token }) {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const toggleIsLoggingIn = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  return (
    <div className={"authContainer"}>
        <button onClick={toggleIsLoggingIn}>
          {isLoggingIn ? "Register" : "Login"}
        </button>
        {isLoggingIn ? <Login /> : <Register />}
    </div>
  );
}

export default App;
