import React, { useContext, useEffect, useState } from "react";
import { getCategories } from "../../../utils/CategoryUtils";
import { UserTokenContext, UserContext, DataContext } from "../../Contexts";

function RecentPurchaseDisplay() {

    const token = useContext(UserTokenContext);
    const user = useContext(UserContext);
    const { purchases, setPurchases } = useContext(DataContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(purchases.length === 0);
    const [noPurchases, setNoPurchases] = useState(false);
    
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
                // if (data.purchases.length === 0) {
                //     setNoPurchases(true);
                // }
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
                {purchases.length > 0 ? (
                    purchases.map(purchase => (
                        <li key={purchase.id}>{purchase.desc} on {purchase.datetime}</li>
                    ))
                ) : (
                    <li>No purchases found</li>
                )}
            </ul>
        </div>
    );
}

export default RecentPurchaseDisplay;