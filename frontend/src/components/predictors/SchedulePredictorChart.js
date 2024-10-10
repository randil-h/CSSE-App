import React, { useEffect, useState } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import axios from 'axios';

const SchedulePredictionChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await axios.post('http://localhost:5555/predictor/predict');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching predictions:', error);
            }
        };

        fetchPredictions();
    }, []);

    return (
        <div className="border-2 rounded-lg shadow-md mt-4 bg-blue-50">
            <div className="p-3">
                <h1 className="font-semibold text-lg">Predicted Schedules for Upcoming Month</h1>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{top: 5, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="location">
                        <Label value="Location" position="insideBottom" offset={-10} style={{fontWeight: "bold", fill: 'black'}}/>
                    </XAxis>
                    <YAxis>
                        <Label value="Predicted Schedules" color="black" angle={-90} position="insideLeft" offset={10} style={{fontWeight: "bold", fill: 'black'}}/>
                    </YAxis>
                    <Tooltip/>
                    <Legend layout="horizontal" align="center" verticalAlign="top" />
                    <Bar dataKey="predictedCount" fill="#69b3a2" name="Predicted Schedule Count"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SchedulePredictionChart;
