import React, { useState, useContext } from "react";
import CategoriesDisplay from "./CategoriesDisplay";
import CategoryCreator from "./CategoryCreator";
import { UserTokenContext } from "../../Contexts";

function CategoriesTab() {

    const token = useContext(UserTokenContext);
    const [displayCategoryCreator, setDisplayCategoryCreator] = useState(false);

    return (
        <div>
            <button onClick={() => setDisplayCategoryCreator(true)}>Create New Category</button>
            {displayCategoryCreator === true && <CategoryCreator setShowCategoryCreator={setDisplayCategoryCreator}/>}
            <CategoriesDisplay/>
        </div>
    );
}

export default CategoriesTab;