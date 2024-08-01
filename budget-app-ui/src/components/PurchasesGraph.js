import { useState, useEffect } from "react";

function PurchasesGraph() {

    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/purchases/all/by-month", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error retrieving data");
            }
            return response.json();
        })
        .then(data => setPurchases(data.purchases));
    }, []);

    return (
        <div>
            
        </div>
    );

}

export default PurchasesGraph;