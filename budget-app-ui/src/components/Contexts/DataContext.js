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
    const [ hasLoaded, setHasLoaded ] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            setHasLoaded(false);
            const categories_result = await getCategories(token);
            setCategories(categories_result);
            const purchases_result = await getPurchases(token);
            setPurchases(purchases_result);
            setHasLoaded(true);
        }
        fetchUserData();
    }, [token]);

    return (
        <DataContext.Provider value={{ categories, setCategories, purchases, setPurchases, hasLoaded, setHasLoaded }}>
            {children}
        </DataContext.Provider>
    );
}