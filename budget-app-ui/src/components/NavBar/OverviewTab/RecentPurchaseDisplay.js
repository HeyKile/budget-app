import React, { useContext, useEffect, useState } from "react";
import { getCategories } from "../../../utils/CategoryUtils";
import { UserTokenContext, UserContext, DataContext } from "../../Contexts";
import { formatDate, getPurchaseCategoryName } from "../../../utils";

const NUM_RECENT_PURCHASES = 4;

function RecentPurchaseDisplay() {

    const token = useContext(UserTokenContext);
    const user = useContext(UserContext);
    const { purchases, setPurchases } = useContext(DataContext);
    const { categories, setCategories } = useContext(DataContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(purchases.length === 0);
    const [noPurchases, setNoPurchases] = useState(false);
    const [recentPurchases, setRecentPurchases] = useState([]);
    
    useEffect(() => {
        if (purchases.length === 0) {
            fetch("http://localhost:5000/budget-app/api/purchase/get-recents", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Origin': 'http://localhost:3000',
                    "Authorization": `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error retrieving purchases`)
                }
                return response.json();
            })
            .then(data => {
                setPurchases(data.purchases);
                if (data.purchases.length === 0) {
                    setNoPurchases(true);
                } else if (data.purchases.length > NUM_RECENT_PURCHASES + 1) {
                    setRecentPurchases(data.purchases.slice(0, NUM_RECENT_PURCHASES))
                } else {
                    setRecentPurchases(data.purchases);
                }
            })
            .catch(error => {
                console.error("Fetch error");
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });   
        }
    }, [purchases, setPurchases, token]);

    if (loading) { 
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (noPurchases || purchases.length === 0) {
        return <div>No purchases found</div>
    }

    return (
        <div>
            <h2>Recent Purchases</h2>
            <ul>
                {recentPurchases.length > 0 ? (
                    recentPurchases.map(purchase => (
                        <li key={purchase.id}>({getPurchaseCategoryName(purchase.cat_id, categories)}) {purchase.desc} on {formatDate(purchase.datetime)}</li>
                    ))
                ) : (
                    <li>No purchases found</li>
                )}
            </ul>
        </div>
    );
}

export default RecentPurchaseDisplay;