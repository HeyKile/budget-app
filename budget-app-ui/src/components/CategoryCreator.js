import React, { useState, useEffect } from 'react';

function CategoryCreator() {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [error, setError] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleBudgetChange = (event) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value)) {
            setBudget(value);
        } else {
            setBudget("");
        }
    };

    const createCategory = (event) => {
        console.log(JSON.stringify({
            "name": name,
            "budget": budget
        }));
        event.preventDefault();
        fetch("http://localhost:8000/categories/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                //TODO: add user id
                "name": name,
                "budget": budget
            })
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
                    <input type="text" value={name} name="name" onChange={handleNameChange}/>
                </label>
                <label>
                    Budget:
                    <input type="text" value={budget} name="budget" onChange={handleBudgetChange}/>
                </label>
                <button type="submit">Create</button>
            </form>
            {statusMsg && <p>{statusMsg}</p>}
        </div>
    );
}

export default CategoryCreator;