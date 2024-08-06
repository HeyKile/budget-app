import React, { useContext, useEffect, useState } from "react";
import UserTokenContext from "./UserTokenContext";
import UserContext from "./UserContext";
import { getCategories } from "../utils/CategoryUtils";

function RecentPurchaseDisplay() {

    const token = useContext(UserTokenContext);
    const user = useContext(UserContext);

    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
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
        })
        .then(async () => {
            // TODO: this is just bad, prob should do server side
            const categories = await getCategories(token);
            console.log(`Categories: ${categories}`);
            const purchasesWithCategoryNames = purchases.map(purchase => {
                const catName = categories.find((category) => category.id === purchase.catId);
                return {
                    "id": purchase.id,
                    "desc": purchase.desc,
                    "catName": catName,
                    "datetime": purchase.datetime
                };
            });
            setPurchases(purchasesWithCategoryNames);
        })
        .catch(error => {
            console.error("Fetch error");
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [token]);

    if (loading) { 
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Recent Purchases</h2>
            <ul>
                {purchases.length > 0 ? (
                    purchases.map(purchase => (
                        <li key={purchase.id}>({purchase.catName}) {purchase.desc} on {purchase.datetime}</li>
                    ))
                ) : (
                    <li>No purchases found</li>
                )}
            </ul>
        </div>
    );
}

export default RecentPurchaseDisplay;