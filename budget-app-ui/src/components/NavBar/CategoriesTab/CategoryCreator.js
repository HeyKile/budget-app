import React, { useState, useEffect, useContext } from 'react';
import { UserTokenContext, UserContext } from '../../Contexts';

function CategoryCreator({ setShowCategoryCreator }) {

    const token = useContext(UserTokenContext);
    const user = useContext(UserContext);

    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [error, setError] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);

    const createCategory = (event) => {
        console.log(JSON.stringify({
            "name": name,
            "budget": budget
        }));
        event.preventDefault();
        const userId = user.id;
        fetch("http://localhost:5000/budget-app/api/category/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Origin': 'http://localhost:3000',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, budget })
        })
        .then(response => {
            if (!response.ok) {
                console.error(response);
                throw new Error(`Network error from fetch in createCategory`);
            }
            return response.json();
        })
        .then(data => {
            setStatusMsg("Successfully created category");
            setName("");
            setBudget("");
        })
        .catch(error => {
            console.error(error);
            setError(error);
        });
    }

    return (
        <div className='category-creator'>
            <h2>Create New Category</h2>
            {error !== null && <p>Error: {error.message}</p>}
            <form onSubmit={createCategory}>
                <label>
                    Name:
                    <input type="text" value={name} name="name" onChange={(e) => setName(e.target.value)}/>
                </label>
                <label>
                    Budget:
                    <input type="number" value={budget} name="budget" onChange={(e) => setBudget(e.target.value)}/>
                </label>
                <button type="submit">Create</button>
            </form>
            {statusMsg && <p>{statusMsg}</p>}
            <button onClick={() => setShowCategoryCreator(false)}>X</button>
        </div>
    );
}

export default CategoryCreator;