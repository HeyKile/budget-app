import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import CategoriesDisplay from './components/CategoriesDisplay';

function App() {

  // const [token, setToken] = useState("");

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("sessionToken");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);

  // if (!token) {
  //   return <Login setToken={setToken}/>
  // }

  return (
    <div className="App">
      <CategoriesDisplay/>
    </div>
  );
}

export default App;