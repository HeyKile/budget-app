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

    useEffect(() => {
        if (categories.length === 0 || purchases.length === 0) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [categories, purchases, setCategories, setPurchases, token]);

    return (
        <div className="overview-container">
            <button onClick={() => setShowPurchaseCreator(true)}>Create New Purchase</button>
            {showPurchaseCreator && <PurchaseCreator setShowPurchaseCreator={setShowPurchaseCreator}/>}
            <div className="overview-items-container">
                <RecentPurchaseDisplay/>
                <OverviewPurchasesGraph/>
            </div>
            <div>

            </div>
        </div>
    );
}

export default Overview;