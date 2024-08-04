import React, { useState, useEffect, createContext } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CategoriesDisplay from './components/CategoriesDisplay';
import CategoryCreator from './components/CategoryCreator';
import PurchaseDisplay from './components/PurchaseDisplay';
import PurchaseCreator from './components/PurchaseCreator';
import ToolBar from './components/Toolbar/ToolBar';
import UserTokenContext from './components/UserTokerContext';
import Logout from './components/Toolbar/Logout';

function App() {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authErr, setAuthErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      // setToken(storedToken);
      validateToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    fetch("http://localhost:5000/budget-app/api/users/validate-token", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        "Authorization": `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        setToken(null);
        localStorage.removeItem("access_token");
        setUser(null);
        localStorage.removeItem("user");
      } else {
        setToken(token);
        const user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
      }
    })
    .catch(err => {
      setAuthErr(err.message);
      setToken(null);
      localStorage.removeItem("access_token");
      setUser(null);
      localStorage.removeItem("user");
    })
    .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!token) {
    return (
      <div>
        {authErr !== null && <h2>{authErr}</h2>}
        <Login setToken={setToken} setUser={setUser} setAuthErr={setAuthErr}/>
      </div>
    );
  }

  return (
    <UserTokenContext.Provider value={token}>
      <div className="App">
        <h1>Hello, {user.username}</h1>
        <ToolBar token={token} setToken={setToken}/>
      </div>
    </UserTokenContext.Provider>
  );
}

export default App;