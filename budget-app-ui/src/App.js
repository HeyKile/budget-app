import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CategoriesDisplay from './components/CategoriesDisplay';
import CategoryCreator from './components/CategoryCreator';
import PurchaseDisplay from './components/PurchaseDisplay';
import PurchaseCreator from './components/PurchaseCreator';

function App() {



  const [token, setToken] = useState(null);
  const [authErr, setAuthErr] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if (!token) {
    return <Login setToken={setToken} setAuthErr={setAuthErr}/>
  }

  return (
    <div className="App">
      <h1>Locked in</h1>
    </div>
  );
}

export default App;