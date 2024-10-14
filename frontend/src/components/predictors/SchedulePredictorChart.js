import React, { useEffect, useState } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import axios from 'axios';
import {FaArrowTrendUp} from "react-icons/fa6";

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
        <div className="border-2 rounded-xl shadow-lg mt-4">
            <div className="flex p-3 justify-center">
                <h1 className="font-semibold text-lg mr-2 lg:mr-2 md:mr-2 sm:mr-1.5">Predicted Schedules for Upcoming Month</h1>
                <FaArrowTrendUp size={25} />
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{top: 5, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="location">
                        <Label value="Location" position="insideBottom" offset={-10} style={{fontWeight: "bold", fill: 'black'}}/>
                    </XAxis>
                    <YAxis>
                        <Label value="Predicted Schedules" color="black" angle={-90} position="insideLeft" offset={10} dy={30} style={{fontWeight: "bold", fill: 'black'}}/>
                    </YAxis>
                    <Tooltip/>
                    <Legend layout="horizontal" align="center" verticalAlign="top" />
                    <Bar dataKey="predictedCount" fill="#69b3a2" name="Predicted Schedule Count" radius={[10,10,0,0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SchedulePredictionChart;
