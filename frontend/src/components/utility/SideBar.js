import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { HomeIcon, BanknotesIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineSchedule } from "react-icons/ai";
import { GrUserWorker } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";
import axios from 'axios';

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const Menus = [
        { name: "Home", path: "/dashboard", icon: HomeIcon },
        { name: "Customers", path: "/finances/home", icon: FiUsers },
        { name: "Collectors", path: "/crop/home", icon: GrUserWorker },

        { name: "Schedules", path: "/schedules/list", icon: AiOutlineSchedule },

        { name: "Schedules", path: "/schedules/home", icon: AiOutlineSchedule },

        { name: "Transactions", path: "/inventory/home", icon: BanknotesIcon },
        { name: "Reports", path: "/insights/marketprice", icon: TbReportAnalytics },
    ];

    const isActive = (path) => {
        const currentPath = location.pathname.split('/')[1];
        return currentPath === path.split('/')[1];
    };

    return (
        <div className="flex">
            <div
                className={`${
                    open ? "w-72" : "w-24"
                } bg-gray-100 h-screen p-5 pt-8 relative duration-300 flex flex-col justify-between`}
            >
                <div>
                    <div
                        className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 rounded-full bg-white ${
                            !open ? "rotate-180" : ""
                        }`}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <IoIosArrowDropleft size={24} /> : <IoIosArrowDropright size={24} />}
                    </div>
                    <ul className="pt-1">
                        {Menus.map((menu, index) => (
                            <Link to={menu.path} key={index}>
                                <li
                                    className={`flex rounded-md p-4 cursor-pointer text-gray-800 font-semibold text-md items-center gap-x-4 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 hover:bg-gray-200 hover:rounded-xl hover:shadow-xl
                        ${menu.gap ? "mt-9" : "mt-2"} ${
                                        isActive(menu.path) && "bg-gray-200 text-lime-700 rounded-xl px-3 shadow-xl hover:bg-gray-200 hover:rounded-xl hover:shadow-xl"
                                    }`}
                                >
                                    {React.createElement(menu.icon, { className: 'w-5 h-5 ml-2' })}
                                    <span className={`${!open && "hidden"} origin-left duration-200 `}>
                                        {menu.name}
                                    </span>
                                    {menu.count !== undefined && open && isActive(menu.path) && (
                                        <span className="bg-gray-600 rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-100">
                                            {loading ? '...' : menu.count}
                                        </span>
                                    )}
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>

                <div className="pb-4">
                    <li
                        className={`flex rounded-md p-4 cursor-pointer text-gray-800 font-semibold text-md items-center gap-x-4 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 hover:bg-red-100 hover:text-red-700 hover:rounded-xl hover:shadow-xl ${
                            open ? "justify-start" : "justify-center"
                        }`}
                        onClick={() => {
                            console.log("Logout clicked");
                        }}
                    >
                        {React.createElement(ArrowLeftStartOnRectangleIcon, { className: 'w-5 h-5 ml-2' })}
                        <span className={`${!open && "hidden"} origin-left duration-200 `}>Logout</span>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;