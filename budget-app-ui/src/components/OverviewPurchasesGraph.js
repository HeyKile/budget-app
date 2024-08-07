import React, { useState, useContext, useEffect } from "react";
import UserTokenContext from "./UserTokenContext";
import { DataContext } from "./DataContext";
import { Line, Bar } from "react-chartjs-2";
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
 } from "chart.js";
import { getCategories } from "../utils/CategoryUtils";

 ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function OverviewPurchasesGraph() {
    
    const token = useContext(UserTokenContext);
    const { categories, setCategories } = useContext(DataContext);
    const { purchases, setPurchases } = useContext(DataContext);
    const [loading, setLoading] = useState(categories.length === 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (categories.length === 0 || purchases.length === 0) {
            return;
        }

        const sortedPurchases = purchases.sort((pur1, pur2) => pur2.catId - pur1.catId);
        console.log(`Sorted:`);
        console.log(sortedPurchases);
        const categoryLabels = categories.map(category => category.name);
        const budgetDataset = {
            label: "Budget",
            data: categories.map(category => category.budget),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            boarderColor: "rgba(54, 162, 235, 1)",
            boardWidth: 1
        }
        // const purchaseLabels = 
        

    }), [categories, setCategories, purchases, setPurchases, token];

    const barData = {
        labels: [
            "rent",
            "groceries",
            "food",
            "utilities",
            "gaming",
        ],
        datasets: [
            {
                label: "Expenses",
                data: [1200, 300, 150, 180, 100],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                boarderColor: "rgba(54, 162, 235, 1)",
                boardWidth: 1
            }
        ]
    };

    const options = {}
    const data = {
        labels: [
            "mon",
            "tue",
            "wed",
            "thu",
            "fri",
            "sat",
            "sun"
        ],
        datasets: [
            {
                label: "Steps",
                data: [3000, 5000, 4500, 6000, 7000, 8000, 9000],
                bordercolor: "rgb(75, 192, 192)"
            },
            {
                label: "Steps but freaking epic sauce",
                data: [5000, 6500, 8000, 7000, 8000, 10000, 9000],
                bordercolor: "rgb(75, 192, 192)"
            }
        ]
    }

    return (
        <div className="overview-purchases-graph-container">
            <h1>Social Network Users</h1>
            {/* <Line options={options} data={data}/> */}
            <Bar option={options} data={barData} />
        </div>
      );

}

export default OverviewPurchasesGraph;