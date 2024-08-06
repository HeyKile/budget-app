export {
    getCategories,
    getCategoryByCatId
};

async function getCategories(token) {
    const response = await fetch("http://localhost:5000/budget-app/api/category/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Origin': 'http://localhost:3000',
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data.categories;
}

async function getCategoryByCatId(token, catId) {
    const response = await fetch("http://localhost:5000/budget-app/api/category/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Origin': 'http://localhost:3000',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ catId })
    });
    if (!response.ok) {
        throw new Error(`Error retrieving category ${catId}`);
    }
    const data = await response.json();
    return data.name;
}

async function getCategoryNames(userId) {

}