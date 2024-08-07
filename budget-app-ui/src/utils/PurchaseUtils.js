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