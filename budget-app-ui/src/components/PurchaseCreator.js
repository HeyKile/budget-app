import React, { useState, useEffect, useContext } from "react";
import UserTokenContext from "./UserTokenContext";
import { DataContext } from "./DataContext";

function PurchaseCreator({ user, setShowPurchaseCreator }) {
    const token = useContext(UserTokenContext);
    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [curCategory, setCurCategory] = useState(0);
    const [statusMsg, setStatusMsg] = useState("");
    // const [categories, setCategories] = useState([]);
    const { categories, setCategories } = useContext(DataContext);
    // const [loading, setLoading] = useState(true);
    const [loading, setLoading] = useState(categories.length === 0);
    const [error, setError] = useState("");

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
                setCategories(data.categories);
                setCurCategory(data.categories[0]);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError(error);
                setLoading(false);
            });
        }
    }, [categories, setCategories, token]);

    const createPurchase = (event) => {
        event.preventDefault();
        console.log(desc);
        console.log(amount);
        console.log(date);
        console.log(curCategory);
        const catId = curCategory.id;
        fetch("http://localhost:5000/budget-app/api/purchase/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Origin': 'http://localhost:3000',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                desc,
                amount,
                date,
                catId
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
            setCurCategory(0);
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
        <div className="create-purchase-modal">
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
                    <select value={curCategory} onChange={(e) => setCurCategory(e.target.value)}>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name} (${category.budget})</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Submit Purchase</button>
            </form>
            <button onClick={() => setShowPurchaseCreator(false)}>X</button>
        </div>
    );
}

export default PurchaseCreator;