import { useState, useEffect } from "react";
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";

const breadcrumbItems = [
    { name: 'Schedules', href: '/schedules/list' },
];

export default function ScheduleList() {
    const [schedules, setSchedules] = useState([]);

    // Fetch schedules from backend on component mount
    useEffect(() => {
        fetch('http://localhost:5555/schedule')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setSchedules(data))
            .catch(error => console.error('Error fetching schedules:', error));
    }, []);


    return (
        <div className="">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>
            <div className="grid sm:grid-cols-6">
                <div className="col-span-1 sticky left-0 top-0">
                    <SideBar />
                </div>
                <div className="w-full col-span-5 flex flex-col">
                    <div className="flex flex-row ">
                        <BackButton />
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    {/* List of schedules */}
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Schedules List</h2>
                        <ul className="space-y-2">
                            {schedules.map(schedule => (
                                <li key={schedule._id} className="p-2 border rounded">
                                    <strong>Waste Type:</strong> {schedule.wasteType} <br />
                                    <strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()} <br />
                                    <strong>Time:</strong> {schedule.time} <br />
                                    <strong>Location:</strong> {schedule.location} <br />
                                    <strong>Special Remarks:</strong> {schedule.specialRemarks}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
