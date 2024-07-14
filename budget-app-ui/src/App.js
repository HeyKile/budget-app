import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';

function App() {

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("sessionToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if (!token) {
    return <Login setToken={setToken}/>
  }

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;