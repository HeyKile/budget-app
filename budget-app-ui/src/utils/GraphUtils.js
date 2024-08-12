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
    const sortedCategories = categories.sort((cat1, cat2) => cat1.id - cat2.id);
    let purchaseData = [];
    for (const curCategory of sortedCategories) {
        const categoryPurchases = purchases.filter(purchase => purchase.cat_id === curCategory.id);
        if (categoryPurchases.length === 0) {
            purchaseData.push(0);
        } else {
            purchaseData.push(categoryPurchases.map(purchase => purchase.amount).reduce((acc, curVal) => acc + curVal));
        }
    }
    let purchaseDataSet = [{
        label: "Amount Spent",
        data: purchaseData,
        backgroundColor: "rgba(255, 99, 0, 0.5)",
        boarderColor: "rgba(54, 162, 235, 1)",
        boardWidth: 1
    }];
    purchaseDataSet.push({
        label:"Total Budget",
        data: sortedCategories.map(category => category.budget),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        boarderColor: "rgba(54, 162, 235, 1)",
        boardWidth: 1
    });

    return {
        labels: sortedCategories.map(category => category.name),
        datasets: purchaseDataSet
    };
}