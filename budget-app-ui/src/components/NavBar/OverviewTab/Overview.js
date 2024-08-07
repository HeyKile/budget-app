import React, { useState, useEffect, useContext } from "react";
import PurchaseCreator from "../PurchasesTab/PurchaseCreator";
import RecentPurchaseDisplay from "./RecentPurchaseDisplay";
import OverviewPurchasesGraph from "./OverviewPurchasesGraph";
import { UserTokenContext, DataContext } from "../../Contexts";

function Overview() {
    const token = useContext(UserTokenContext);
    const [showPurchaseCreator, setShowPurchaseCreator] = useState(false);
    const { categories, setCategories } = useContext(DataContext);
    const { purchases, setPurchases } = useContext(DataContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (categories.length === 0) {
            const fetchCategories = fetch("http://localhost:5000/budget-app/api/category/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Origin': 'http://localhost:3000',
                    "Authorization": `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network error`);
                }
                return response.json();
            })
            .then(data => {
                setCategories(data.categories);
            });

            const fetchPurchases = fetch("http://localhost:5000/budget-app/api/purchase/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Origin': 'http://localhost:3000',
                    "Authorization": `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error retrieving data");
                }
                return response.json();
            })
            .then(data => {
                setPurchases(data.purchases);
            });

            Promise.all([fetchCategories, fetchPurchases])
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
        }
    }, [categories, purchases, setCategories, setPurchases, token]);

    return (
        <div className="overview-container">
            <button onClick={() => setShowPurchaseCreator(true)}>Create New Purchase</button>
            {showPurchaseCreator && <PurchaseCreator setShowPurchaseCreator={setShowPurchaseCreator}/>}
            <div className="recent-purchases-container">
                <RecentPurchaseDisplay/>
                <OverviewPurchasesGraph/>
            </div>
            <div>

            </div>
        </div>
    );
}

export default Overview;