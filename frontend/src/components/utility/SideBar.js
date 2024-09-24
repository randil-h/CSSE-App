import { Link, useLocation } from "react-router-dom";
import { PiPlant } from "react-icons/pi";
import { HiMiniCalendarDays } from "react-icons/hi2";
import {
    ArrowLeftStartOnRectangleIcon,
    HomeIcon,
    BanknotesIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import {
    Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import { MdOutlineInventory2 } from "react-icons/md";
import { useEffect, useState } from "react";
import {PiUsers } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineSchedule } from "react-icons/ai";
import { GrUserWorker } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";

export default function SideBar() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const isActive = (path) => {
        const currentPath = location.pathname.split('/')[1];
        return currentPath === path.split('/')[1];
    };

    const menuItems = [
        { name: "Home", path: "/dashboard", icon: HomeIcon },
        { name: "Customers", path: "/customers/home", icon: FiUsers},
        { name: "Collectors", path: "/collectors/home", icon: GrUserWorker },
        { name: "Schedules", path: "/schedules/home", icon: AiOutlineSchedule },
        { name: "Transactions", path: "/transactions/home", icon: BanknotesIcon },
        { name: "Reports", path: "/reports/home", icon: TbReportAnalytics },
    ];

    const systemItems = [
        { name: "Logout", path: "/", icon: ArrowLeftStartOnRectangleIcon },
    ];

    return (
        <div className="bg-gray-100 bottom-0 top-12 fixed w-1/6 border-r flex flex-col justify-between divide-y divide-gray-300">
            {/* First ul */}
            <ul className="flex flex-col items-center text-gray-800 font-medium text-base py-4 px-3">
                {menuItems.map((item) => (
                    <Link key={item.name} to={item.path} className="w-full flex flex-row">
                        <li
                            className={`flex flex-row w-full h-12 my-1 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 ${
                                isActive(item.path) ? "bg-gray-200 text-lime-700 rounded-xl px-3 shadow-xl" : "hover:bg-gray-200 hover:rounded-xl hover:shadow-xl"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="pl-3 flex items-center">
                                    {item.icon && <item.icon className="mr-4 h-5 w-5" />}
                                    {item.name}
                                </div>
                                {isActive(item.path) && item.count && (
                                    <span
                                        className="bg-gray-600 rounded-full w-5 h-5 mr-2 flex items-center justify-center text-xs text-gray-100">
                    {item.count}
                  </span>
                                )}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>

            {/* Second ul */}
            <ul className="flex flex-row items-center gap-2 font-medium text-base py-4 px-4">
                {systemItems.map((item) => (
                    <Link key={item.name} to={item.path} className="w-full">
                        <li
                            className={`flex text-gray-700 w-full h-12 my-1 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 ${
                                isActive(item.path) ? "bg-gray-200 text-black rounded-xl px-3" : "hover:bg-red-100 hover:text-red-700 hover:shadow-xl hover:rounded-xl"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="pl-3 flex items-center">
                                    {item.icon && <item.icon className="mr-4 h-5 w-5" />}
                                    {item.name}
                                </div>
                                {isActive(item.path) && item.count && (
                                    <span
                                        className="bg-gray-600 rounded-full w-5 h-5 mr-2 flex items-center justify-center text-xs text-gray-100">
                    {item.count}
                  </span>
                                )}
                            </div>
                        </li>
                    </Link>
                ))}
                {/* Add cog icon here */}
                <li className={`flex w-16 h-12 transition-all bg-gray-200 duration-200 ${isActive("/settings") ? "text-gray-700  bg-gradient-to-br from-lime-300 to-emerald-300 duration-200 animate-spin" : "text-gray-600"} hover:bg-gray-300 rounded-full`}>
                    <Link to="/settings" className="flex items-center justify-center w-full">
                        <Cog6ToothIcon className="w-6 h-6" />
                    </Link>
                </li>
            </ul>
        </div>
    );
}
