import React, { useState, createContext } from "react";
import UserTokenContext from "./UserTokenContext";

export const DataContext = createContext();

export function DataProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [purchases, setPurchases] = useState([]);

    return (
        <DataContext.Provider value={{ categories, setCategories, purchases, setPurchases }}>
            {children}
        </DataContext.Provider>
    );
}