import React, { useState, useEffect } from 'react';

function CategoriesDisplay() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/categories/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network error`);
            }
            return response.json();
        })
        .then(data => {
            setCategories(data.categories);
            setLoading(false);
        })
        .catch(error => {
            console.error("Problem w/ fetch");
            setError(error);
            setLoading(false);
        })
    }, []);

    if (loading) { 
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <p>Categories</p>
            <ul>
                {categories.length > 0 ? (
                    categories.map(category => (
                        <li key={category.id}>{category.name}</li>
                    ))
                ) : (
                    <li>No categories found</li>
                )}
            </ul>
        </div>
    );

}

export default CategoriesDisplay;