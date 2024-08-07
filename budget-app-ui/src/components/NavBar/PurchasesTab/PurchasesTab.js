import React, { useState } from "react";
import PurchaseCreator from "./PurchaseCreator";
import PurchaseDisplay from "./PurchaseDisplay";

function PurchasesTab() {

    const [showPurchaseCreator, setShowPurchaseCreator] = useState(false);

    return (
        <div className="purchases-tab-container">
            <button onClick={() => setShowPurchaseCreator(true)}>Create New Purchase</button>
            {showPurchaseCreator && <PurchaseCreator setShowPurchaseCreator={setShowPurchaseCreator} />}
            <PurchaseDisplay />
        </div>
    );

}

export default PurchasesTab;