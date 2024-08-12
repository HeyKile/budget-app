const DATETIME_MONTH_START = 8;
const DATETIME_MONTH_END = 11;
const DATETIME_YEAR_START = 12;
const DATETIME_YEAR_END = 16;
const DATE_MONTH_START = 4;
const DATE_MONTH_END = 7;
const DATETIME_DAY_START = 5;
const DATETIME_DAY_END = 7;
const DATE_DAY_START = 8;
const DATE_DAY_END = 10;

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

export function getCurrentMonthPurchases(purchases) {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return purchases.filter(purchase => isPurchaseInCurrentMonth(purchase, firstDayOfMonth, lastDayOfMonth));
}

function isPurchaseInCurrentMonth(purchase, firstDayOfMonth, lastDayOfMonth) {
    const purchaseYear = purchase.datetime.substring(DATETIME_YEAR_START, DATETIME_YEAR_END);
    const curYear = firstDayOfMonth.getFullYear().toString();
    if (purchaseYear !== curYear) {
        return false;
    }
    const purchaseMonth = purchase.datetime.substring(DATETIME_MONTH_START, DATETIME_MONTH_END);
    const curMonth = firstDayOfMonth.toString().substring(DATE_MONTH_START, DATE_MONTH_END);
    if (purchaseMonth !== curMonth) {
        return false;
    }
    const purchaseDay = Number(purchase.datetime.substring(DATETIME_DAY_START, DATETIME_DAY_END));
    const firstMonthDay = Number(firstDayOfMonth.toString().substring(DATE_DAY_START, DATE_DAY_END));
    const lastMonthDay = Number(lastDayOfMonth.toString().substring(DATE_DAY_START, DATE_DAY_END));
    return (firstMonthDay <= purchaseDay) && (purchaseDay <= lastMonthDay);
}