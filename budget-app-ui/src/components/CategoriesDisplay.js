import React, { useState, useEffect, useContext } from 'react';
import UserTokenContext from './UserTokenContext';
import { DataContext } from './DataContext';

function CategoriesDisplay() {

    const token = useContext(UserTokenContext);

    const { categories, setCategories } = useContext(DataContext);
    const [loading, setLoading] = useState(categories.length == 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (categories.length === 0) {
            fetch("http://localhost:5000/budget-app/api/category/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Origin': 'http://localhost:3000',
                    "Authorization": `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network error`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setCategories(data.categories);
                setLoading(false);
            })
            .catch(error => {
                console.error("Problem w/ fetch");
                setError(error);
                setLoading(false);
            })
        }
    }, [categories, setCategories, token]);

    if (loading) { 
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.length > 0 ? (
                    categories.map(category => (
                        <li key={category.id}>{category.name}: {category.budget} ({category.id})</li>
                    ))
                ) : (
                    <li>No categories found</li>
                )}
            </ul>
        </div>
    );

}

export default CategoriesDisplay;