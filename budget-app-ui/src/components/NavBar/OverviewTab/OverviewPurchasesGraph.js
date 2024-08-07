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
import { getPurchasesByCategory } from "../../../utils/PurchaseUtils";

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
    const [sortedPurchases, setSortedPurchases] = useState([]);
    const [error, setError] = useState(null);
    const [barData, setBarData] = useState({});

    let epicLabels = [];

    useEffect(() => {
        async function fetchData() {
            try {
                const sortedPurchasesByCategory = await getPurchasesByCategory(token);
                setSortedPurchases(sortedPurchasesByCategory);
                console.log(sortedPurchasesByCategory);
                for (let i = 0; i < sortedPurchasesByCategory.length; i++) {
                    console.log(`CatId: ${sortedPurchasesByCategory[i][0].cat_id}`)
                    for (let j = 0; j < sortedPurchasesByCategory[i].length; j++) {
                        console.log(sortedPurchasesByCategory[i][j]);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);

    // useEffect(() => {
    //     if (categories.length === 0 || purchases.length === 0) {
    //         return;
    //     }
    //     setLoading(true);
    //     const sortedPurchases = purchases.sort((pur1, pur2) => pur2.catId - pur1.catId);
    //     const categoryLabels = categories.sort((cat1, cat2) => cat2.id - cat1.id).map(category => category.name);
    //     const budgetDataset = {
    //         label: "Budget",
    //         data: categories.map(category => category.budget),
    //         backgroundColor: "rgba(255, 99, 132, 0.2)",
    //         boarderColor: "rgba(54, 162, 235, 1)",
    //         boardWidth: 1
    //     }
    //     const purchasesDataSet = {
    //         label: "Amount Spent",
    //         // data: 
    //     };
    //     epicLabels = categoryLabels;
    //     console.log(epicLabels);
    //     setBarData({
    //         // labels: [
    //         //     "rent",
    //         //     "groceries",
    //         //     "food",
    //         //     "utilities",
    //         //     "gaming",
    //         // ],
    //         labels: epicLabels,
    //         datasets: [
    //             {
    //                 label: "Amount spent",
    //                 data: [1200, 300, 150, 180, 100],
    //                 backgroundColor: "rgba(255, 99, 132, 0.5)",
    //                 boarderColor: "rgba(54, 162, 235, 1)",
    //                 boardWidth: 1
    //             }
    //         ]
    //     })
    //     setLoading(false);
    // }, [categories, setCategories, purchases, setPurchases, token]);

     

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
    if (loading) {
        return (
            <h2>Loading...</h2>
        );
    }

    return (
        <div className="overview-purchases-graph-container">
            <h1>Social Network Users</h1>
            {/* <Line options={options} data={data}/> */}
            {/* <Bar option={options} data={barData} /> */}
            {sortedPurchases.length !== 0 && (<ul>
                {sortedPurchases.map(purchaseCat => {
                    purchaseCat.map(purchase => <li>{purchase.name}</li>)
                })}
            </ul>)}
        </div>
      );

}

export default OverviewPurchasesGraph;