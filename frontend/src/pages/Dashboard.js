import React, {useEffect, useState} from "react";
import SideBar from "../components/utility/SideBar";
import Navbar from "../components/utility/Navbar";
import BackButton from "../components/utility/BackButton";
import Breadcrumb from "../components/utility/Breadcrumbs";
import {SnackbarProvider} from "notistack";

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [currentTile, setCurrentTile] = useState(1);

    const breadcrumbItems = [
        { name: 'Home', href: '/dashboard' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTile((prevTile) => (prevTile === 1 ? 2 : 1));
        }, 5000); // Switch every 20 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <SnackbarProvider>
            <div className="">
                <div className="sticky top-0 z-10">
                    <Navbar />
                </div>
                <div className="">
                    <div className="grid sm:grid-cols-6 ">
                        <div className="  col-span-1 sticky top-0">
                            <SideBar/>
                        </div>

                        <div className="w-full col-span-5 flex flex-col ">
                            <div className="flex flex-row ">
                                <BackButton/>
                                <Breadcrumb items={breadcrumbItems}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    );
}
