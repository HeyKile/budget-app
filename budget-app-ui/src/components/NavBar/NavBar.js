import React, { useState, useContext } from "react";
import Overview from "./OverviewTab/Overview";
import PurchaseDisplay from "./PurchasesTab/PurchaseDisplay";
import { CategoryCreator, CategoriesDisplay } from "./CategoriesTab";

const TABS = {
    OVERVIEW: 0,
    PURCHASES: 1,
    CATEGORIES: 2
};

function NavBar() {

    const [curTab, setCurTab] = useState(TABS.OVERVIEW);

    return (
        <div>
            <button onClick={() => setCurTab(TABS.OVERVIEW)}>Overview</button>
            <button onClick={() => setCurTab(TABS.PURCHASES)}>Purchases</button>
            <button onClick={() => setCurTab(TABS.CATEGORIES)}>Categories</button>
            {curTab === TABS.OVERVIEW && <Overview />}
            {curTab === TABS.PURCHASES && <PurchaseDisplay/>}
            {curTab === TABS.CATEGORIES && (
                <CategoriesDisplay/>
                
            )}
        </div>
    );
}

export default NavBar;