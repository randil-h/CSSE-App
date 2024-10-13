import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/utility/Navbar";
import { Link } from 'react-router-dom';
import SideBar from "../../components/utility/SideBar";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import styles

import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import {
  ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {PencilSquareIcon} from "@heroicons/react/16/solid";
import axios from "axios";


export default function Customers() {
  const navigate = useNavigate();

  // State for sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // State for bins and zones
  const [binsData, setBinsData] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("All Zones");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("https://csse-backend.vercel.app/customer"); // Replace with your actual backend URL
        if (response.status === 200) {
          setCustomers(response.data);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch customers");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  /*if (error) {
    return <div>Error: {error}</div>;
  }*/



  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* Navbar */}
      <div className="sticky top-0 z-10">
        <Navbar />
        {/* Small Navbar with Sidebar Toggle Button */}
        <div className="bg-neutral-200 border-b border-neutral-300 bg-opacity-70 backdrop-blur w-full h-8 flex items-center justify-between px-4">
          <div className="text-gray-700 font-semibold">Customers</div>
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center text-black p-2 rounded-full transition"
            aria-label="Toggle Sidebar"
          >
            {isSidebarVisible ? (
              <ArchiveBoxArrowDownIconSolid className="h-6 w-6" />
            ) : (
              <ArchiveBoxArrowDownIconOutline className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Main content */}
        <div className={`flex-1 p-4 transition-all duration-300 ease-in-out`}>
          <div id="print-area">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 shadow-md uppercase bg-gray-100 border-l-4 border-gray-500">
              <tr>
                <th></th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Address</th>
                <th scope="col" className="py-3">
                  <span className="sr-only">Info</span>
                </th>
                <th scope="col" className="py-3">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="py-3">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
              </thead>
              <tbody className="border-b border-gray-200">
              {customers.map((customer, index) => (
                <tr key={customer._id} className="divide-y border-l-4 border-blue-400">
                  <td></td>
                  <td className="px-6 py-4">{customer.name}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.address}</td>
                  <td className="py-4 text-right">
                    <Link to={`/customers/viewCustomerDetails/${customer._id}`}>
                      <InformationCircleIcon
                        className="h-6 w-6 flex-none bg-gray-200 p-1 rounded-full text-gray-800 hover:bg-gray-500"
                        aria-hidden="true"
                      />
                    </Link>
                  </td>

                    <td className="py-4 text-right">
                      <Link to={`/customers/editCustomer/${customer._id}`}>
                        <PencilSquareIcon
                          className="h-6 w-6 flex-none bg-blue-200 p-1 rounded-full text-gray-800 hover:bg-blue-500"
                          aria-hidden="true"
                        />
                      </Link>
                    </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg z-40 p-4 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
          style={{width: '300px'}}  // Sidebar width
        >
          <SideBar onClose={toggleSidebar}/>
        </div>
      </div>
    </div>
  );
}


