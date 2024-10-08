import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BinChart = ({ binSummary }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Number of bins that are more than 75% full</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={binSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="binCount" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BinChart;
