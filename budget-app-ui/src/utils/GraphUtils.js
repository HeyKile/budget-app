export {
    createGraphData
};

const COLORS = {
    UNDER_BEDGET: "rgba(255, 0, 0, 0.5)",
    NEAR_BUDGET: "rgba(0, 99, 0, 0.5)",
    OVER_BUDGET: "rgba(0, 0, 132, 0.5)"
};

function createGraphData(categories, purchases) {
    if (categories === null || purchases === null) {
        return null;
    }

    if (categories.length === 0) {
        return null;
    }
    // const categoryIds = categories.sort((cat1, cat2) => cat2.id - cat1.id).map(category => category.id);
    const sortedCategories = categories.sort((cat1, cat2) => cat2.id - cat1.id);
    let purchaseData = [];
    for (const curCategory of sortedCategories) {
        const categoryPurchases = purchases.filter(purchase => purchase.cat_id === curCategory.id);
        if (categoryPurchases.length === 0) {
            purchaseData.push(0);
            continue;
        }
        const sumPurchases = categoryPurchases.map(purchase => purchase.amount).reduce((acc, curVal) => acc + curVal);
        purchaseData.push(sumPurchases);
        // let dataColor;
        // if (sumPurchases > curCategory.budget) {
        //     dataColor = COLORS.OVER_BUDGET;
        // } else if (sumPurchases <= curCategory.budget && sumPurchases >= (curCategory.budget * 0.75)) {
        //     dataColor = COLORS.NEAR_BUDGET;
        // } else {
        //     dataColor = COLORS.UNDER_BEDGET;
        // }
    }
    let purchaseDataSet = [{
        label: "Amount Spent",
        data: purchaseData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        boarderColor: "rgba(54, 162, 235, 1)",
        boardWidth: 1
    }];

    return {
        labels: sortedCategories.map(category => category.name),
        datasets: purchaseDataSet
    };
}