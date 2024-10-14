import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label} from 'recharts';
import {FaArrowTrendUp} from "react-icons/fa6";
import {IoIosTimer} from "react-icons/io";

// Define the days of the week for the dropdown
const daysOfWeek = [
    { value: 1, label: 'Sunday' },
    { value: 2, label: 'Monday' },
    { value: 3, label: 'Tuesday' },
    { value: 4, label: 'Wednesday' },
    { value: 5, label: 'Thursday' },
    { value: 6, label: 'Friday' },
    { value: 7, label: 'Saturday' }
];

const SchedulesByHourChart = () => {
    const [day, setDay] = useState(1); // Default to Sunday
    const [data, setData] = useState([]);

    // Fetch data from the backend
    const fetchData = async (dayOfWeek) => {
        try {
            const response = await axios.get(`http://localhost:5555/newSchedule/timeslot-average?dayOfWeek=${dayOfWeek}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data whenever the day filter changes
    useEffect(() => {
        fetchData(day);
    }, [day]);

    return (
        <div className="rounded-xl shadow-lg border-2 mt-4">
            {/* Dropdown for selecting day of the week */}
            <div className="mt-4 flex justify-center items-center">
                <h1 className="font-semibold text-lg mr-2 lg:mr-2 md:mr-2 sm:mr-1.5">Average Schedules by the Hour
                    </h1>
                <IoIosTimer size={25} className="blink-icon" />
                <select id="dayFilter" className="rounded-lg ml-4 " value={day}
                        onChange={(e) => setDay(parseInt(e.target.value))}>
                    {daysOfWeek.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                </select>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeslot" l>
                        <Label value="Time Slot" position="insideBottom" offset={-10} style={{fontWeight: "bold"}}/>
                    </XAxis>
                    <YAxis label={{ value: 'Average Schedules', angle: -90, position: 'insideLeft', fontWeight: 'bold' }} />
                    <Tooltip />
                    <Legend layout="horizontal" align="center" verticalAlign="top" />
                    <Bar dataKey="averageSchedules" fill="#3B82F6" radius={[10,10,0,0]} name="Average Schedules" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SchedulesByHourChart;
