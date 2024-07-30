import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import CategoriesDisplay from './components/CategoriesDisplay';
import CategoryCreator from './components/CategoryCreator';
import PurchaseDisplay from './components/PurchaseDisplay';
import PurchaseCreator from './components/PurchaseCreator';

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
      <CategoryCreator />
      <CategoriesDisplay/>
      <PurchaseDisplay/>
      <PurchaseCreator/>
    </div>
  );
}

export default App;