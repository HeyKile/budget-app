import React, { useState, useEffect } from "react";

function PurchaseCreator() {
    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [catId, setCatId] = useState(0);
    const [statusMsg, setStatusMsg] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            console.error(error);
            setError(error);
            setLoading(false);
        })
    }, []);

    const createPurchase = (event) => {
        event.preventDefault();
        console.log(desc);
        console.log(amount);
        console.log(date);
        console.log(catId);
        fetch("http://localhost:8000/purchases/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": 1, //TODO: add functionality
                "desc": desc,
                "amount": amount,
                "date": date,
                "cat_id": catId
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error in fetch");
            }
            return response.json();
        })
        .then(data => {
            setStatusMsg("Successfully created purchase");
            setDesc("");
            setAmount(0);
            setDate("");
            setCatId(0);
        })
        .catch(error => {
            console.error(error);
            setStatusMsg("Error Creating Purchase");
        });
    }

    if (loading) { 
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Create New Purchase</h2>
            {statusMsg !== "" && <p>{statusMsg}</p>}
            <form onSubmit={createPurchase}>
                <label>
                    Description:
                    <input type="text" value={desc} name="desc" onChange={(e) => setDesc(e.target.value)}/>
                </label>
                <label>
                    Amount:
                    <input type="number" value={amount} name="amount" onChange={(e) => setAmount(e.target.value)}/>
                </label>
                <label>
                    Date:
                    <input type="date" value={date} name="date" onChange={(e) => setDate(e.target.value)}/>
                </label>
                <label>
                    Category:
                    <select value={catId} onChange={(e) => setCatId(e.target.value)}>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name} (${category.budget})</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Submit Purchase</button>
            </form>
        </div>
    );
}

export default PurchaseCreator;