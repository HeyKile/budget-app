import React, { useState, createContext, useEffect, useCallback, useContext } from "react";
import UserTokenContext from "./UserTokenContext";
import { getCategories } from "../../utils";
import { getPurchases } from "../../utils/PurchaseUtils";

export const DataContext = createContext();

// TODO: find some way to updates purchases and categories when added w/o calling api again
export function DataProvider({ children }) {
    const token = useContext(UserTokenContext);
    const [categories, setCategories] = useState([]);
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        async function fetchUserData() {
            const categories_result = await getCategories(token);
            setCategories(categories_result);
            const purchases_result = await getPurchases(token);
            setPurchases(purchases_result);
        }
        fetchUserData();
    }, [token]);

    return (
        <DataContext.Provider value={{ categories, setCategories, purchases, setPurchases }}>
            {children}
        </DataContext.Provider>
    );
}