export {
    createGraphData
};

const COLORS = {
    UNDER_BEDGET: "rgba(255, 99, 132, 0.5)",
    NEAR_BUDGET: "rgba(255, 99, 132, 0.5)",
    OVER_BUDGET: "rgba(255, 99, 132, 0.5)"
};

function createGraphData(categories, purchases) {
    if (categories === null || purchases === null) {
        return null;
    }

    if (categories.length === 0) {
        return null;
    }
    const categoryIds = categories.sort((cat1, cat2) => cat2.id - cat1.id).map(category => category.id);
    let dataSets = [];
    for (const curId of categoryIds) {
        const categoryPurchases = purchases.filter(purchase => purchase.cat_id === curId);
        if (categoryPurchases.length === 0) {
            // TODO: finish
            console.warn(`No purchases found for category ID ${curId}`);
            continue;
        }
        const sumPurchases = categoryPurchases.map(purchase => purchase.amount).reduce((acc, curVal) => acc + curVal);
        let dataColor;
        
    }
}