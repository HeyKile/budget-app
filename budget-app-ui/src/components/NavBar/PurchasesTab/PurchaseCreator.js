import React, { useState, useEffect, useContext } from "react";
import { UserTokenContext, DataContext } from "../../Contexts";

function PurchaseCreator({ user, setShowPurchaseCreator }) {
    const token = useContext(UserTokenContext);
    const [desc, setDesc] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const { categories, setCategories } = useContext(DataContext);
    const [curCategory, setCurCategory] = useState({});
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
                if (data.categories.length === 0) {
                    setCurCategory(data.categories[0]);
                    setError("Please create a category before logging a purchase!")
                } else {
                    setError("");
                }
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
        if (desc === "") {
            setStatusMsg("Please enter a description for your purchase");
            return;
        }
        if (amount === 0) {
            setStatusMsg("Please enter an amount for your purchase");
            return;
        }
        if (date === "") {
            setStatusMsg("Please enter a date for your purchases");
            return;
        }
        if (Object.keys(curCategory).length === 0) {
            setStatusMsg("Please select a category for your purchase");
            return;
        }
        console.log(desc);
        console.log(amount);
        console.log(date);
        console.log(curCategory);
        fetch("http://localhost:5000/budget-app/api/purchase/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Origin': 'http://localhost:3000',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "desc": desc,
                "amount": amount,
                "date": date,
                "cat_id": curCategory,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error in fetch");
            }
            return response.json();
        })
        .then(() => {
            setStatusMsg("Successfully created purchase");
            setDesc("");
            setAmount(0);
            setDate("");
            setCurCategory({});
        })
        .catch(error => {
            console.error(error);
            setStatusMsg("Error Creating Purchase");
        });
    }

    if (loading || categories.length === 0) { 
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
                    <input 
                        type="text"
                        value={desc}
                        name="desc"
                        onChange={(e) => setDesc(e.target.value)}
                        autoComplete="off"
                    />
                </label>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        name="amount"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date} name="date"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <label>
                    Category:
                    <select
                        value={curCategory}
                        onChange={(e) => setCurCategory(e.target.value)}>
                        <option></option>
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