import React, { useState, useContext, useEffect } from "react";
import { UserTokenContext, DataContext } from "../../Contexts";
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
import { getCategories } from "../../../utils/CategoryUtils";
import { getPurchaseCategoryName, getPurchasesByCategory } from "../../../utils/PurchaseUtils";
import { createGraphData } from "../../../utils";

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
    const { hasLoaded, setHadLoaded } = useContext(DataContext);
    const [loading, setLoading] = useState(categories.length === 0);
    const [sortedPurchases, setSortedPurchases] = useState([]);
    const [error, setError] = useState(null);
    let graphData = [];

    useEffect(() => {
        async function fetchData() {
            try {
                const sortedPurchasesByCategory = await getPurchasesByCategory(token);
                setSortedPurchases(sortedPurchasesByCategory);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

            if (categories.length === 0) {
                return;
            }
        }
        fetchData();
    }, [purchases, setPurchases, categories, setCategories, token]);

    function createGraphDataPrime() {
        if (categories.length === 0 || categories) {
            return;
        }
        console.log(categories);
        const categoryLabels = categories.map(category => category.name);
        console.log(categoryLabels);
        let purchasesByCategroy = []
        for (const group of sortedPurchases) {
            let curLabel = getPurchaseCategoryName(group[0].cat_id, categories);
            let purchaseData = group.map(purchase => purchase.amount).reduce((acc, cur) => acc + cur);
            purchasesByCategroy.push({
                label: curLabel,
                data: purchaseData,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                boarderColor: "rgba(54, 162, 235, 1)",
                boardWidth: 1
            });
        }
        return {
            categoryLabels,
            purchasesByCategroy
        };
    }

    const options = {}
    const barData = {
        labels: [
            "rent",
            "groceries",
            // "food",
            // "utilities",
            // "gaming",
        ],
        datasets: [
            {
                label: "Amount spent",
                // data: [1200, 300, 150, 180, 100],
                data: [1200, 300],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                boarderColor: "rgba(54, 162, 235, 1)",
                boardWidth: 1
            }
        ]
    }
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

    if (loading || !hasLoaded) {
        return (
            <h2>Loading...</h2>
        );
    }

    if (sortedPurchases.length === 0) {
        return (
            <h2>No data yet this month!</h2>
        );
    } else {
        graphData = createGraphData(categories, purchases);
    }

    return (
        <div className="overview-purchases-graph-container">
            <h1>Your Monthly Outlook</h1>
            {/* <Line options={options} data={data}/> */}
            {graphData !== undefined && graphData.length === 0  && <Bar option={options} data={barData} />}
        </div>
      );

}

export default OverviewPurchasesGraph;