import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
import { PiTruckFill } from "react-icons/pi";

const CollectionTruckRadialChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchTruckStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5555/collectionTruck/truck_status');
                const formattedData = response.data.map(item => ({
                    name: item._id,   //status
                    value: item.count  //count of trucks
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching truck status:', error);
            }
        };

        fetchTruckStatus();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699'];

    return (
        <div className="mt-4 rounded-xl shadow-lg border-2 w-full max-w-2xl mx-auto"> {/* Full width and responsive */}
            <div className="flex p-3 justify-center items-center">
                <h1 className="font-semibold text-lg mr-2">Collection Trucks</h1>
                <PiTruckFill size={25} />
            </div>
            {/* ResponsiveContainer automatically adjusts based on the container size */}
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius="60%"
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CollectionTruckRadialChart;
