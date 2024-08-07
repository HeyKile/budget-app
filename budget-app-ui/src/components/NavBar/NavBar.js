import React, { useState, useContext } from "react";
import { Overview } from "./OverviewTab";
import { CategoriesTab } from "./CategoriesTab";
import { PurchasesTab } from "./PurchasesTab";

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
            {curTab === TABS.PURCHASES && <PurchasesTab />}
            {curTab === TABS.CATEGORIES && <CategoriesTab />}
        </div>
    );
}

export default NavBar;