import React, { useContext, useEffect, useState } from "react";
import { UserTokenContext, UserContext, DataContext } from "../../Contexts";

function PurchaseDisplay() {

    const token = useContext(UserTokenContext);
    const user = useContext(UserContext);
    const { purchases, setPurchases } = useContext(DataContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(purchases.length === 0);
    
    useEffect(() => {
        if (purchases.length === 0) {
            fetch("http://localhost:5000/budget-app/api/purchase/get", {
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
            })
            .catch(error => {
                console.error("Fetch error");
                setError(error);
            })
            .finally(() => {
                setLoading(false)
            });   
        }
    }, [purchases, setPurchases, token]);

    if (loading) { 
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>All Purchases</h2>
            <ul>
                {purchases.length > 0 ? (
                    purchases.map(purchase => (
                        <li key={purchase.id}>{purchase.desc}: ${purchase.amount} on {purchase.date} in category {purchase.cat_id}</li>
                    ))
                ) : (
                    <li>No purchases found</li>
                )}
            </ul>
        </div>
    );
}

export default PurchaseDisplay;