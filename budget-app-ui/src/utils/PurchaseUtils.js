export async function getPurchases(token) {
    const response = await fetch("http://localhost:5000/budget-app/api/purchase/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Origin': 'http://localhost:3000',
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        return [];
    }
    const data = await response.json();
    return data.purchases;
}

export async function getPurchasesByCategory(token) {
    const response = await fetch("http://localhost:5000/budget-app/api/overview/graph-info", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Origin': 'http://localhost:3000',
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        console.error(`Network error getting sorted purchases`);
    }
    const data = await response.json();
    return data.purchases;
}

export function getPurchaseCategoryName(catId, categories) {
    const category = categories.find(category => category.id === catId);
    return category ? category.name : 'Unknown Category';
}

export function formatDate(date) {
    const DATE_STR_LEN_BEFORE_TIME = 16;
    return date.substring(0, DATE_STR_LEN_BEFORE_TIME);
}