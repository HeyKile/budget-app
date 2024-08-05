import React, { useState, useEffect, createContext } from 'react';
import Login from './components/Login';
import ToolBar from './components/Toolbar/ToolBar';
import UserTokenContext from './components/UserTokenContext';
import Register from './components/Register';
import CategoryCreator from './components/CategoryCreator';
import CategoriesDisplay from './components/CategoriesDisplay';
import NavBar from './components/NavBar';
import UserContext from "./components/UserContext";

function App() {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authErr, setAuthErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
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
        <button onClick={() => setRegistering(!registering)}>Swap</button>
        {authErr !== null && <h2>{authErr}</h2>}
        {registering === false ? (
          <Login setToken={setToken} setUser={setUser} setAuthErr={setAuthErr}/>
        ) : (
          <Register setRegistering={setRegistering}/>
        )}
      </div>
    );
  }

  return (
    <UserTokenContext.Provider value={token}>
      <UserContext.Provider value={user}>
        <div className="App">
          <h1>Hello, {user.username}</h1>
          <ToolBar setUser={setUser} setToken={setToken}/>
          {/* <CategoryCreator user={user} />
          <CategoriesDisplay/> */}
          <NavBar/>
        </div>
      </UserContext.Provider>
    </UserTokenContext.Provider>
  );
}

export default App;