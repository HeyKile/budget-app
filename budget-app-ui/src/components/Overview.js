import React, { useState, useEffect, useContext } from "react";
import UserTokenContext from "./UserTokenContext";
import PurchaseCreator from "./PurchaseCreator";
import RecentPurchaseDisplay from "./DisplayRecentPurchase";
import PurchaseDisplay from "./PurchaseDisplay";

function Overview() {
    const token = useContext(UserTokenContext);
    const [showPurchaseCreator, setShowPurchaseCreator] = useState(false);

    return (
        <div className="overview-container">
            <button onClick={() => setShowPurchaseCreator(true)}>Create New Purchase</button>
            {showPurchaseCreator && <PurchaseCreator setShowPurchaseCreator={setShowPurchaseCreator}/>}
            <div className="recent-purchases-container">
                <RecentPurchaseDisplay/>
            </div>
        </div>
    );
}

export default Overview;