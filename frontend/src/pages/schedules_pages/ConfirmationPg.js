import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import { useState } from 'react';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxArrowDownIcon as ArchiveBoxArrowDownIconOutline } from '@heroicons/react/24/outline';
import Breadcrumb from "../../components/utility/Breadcrumbs";

export default function SpecialCollectionConfirmation() {
    const navigate = useNavigate();
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const goToHistory = () => {
        navigate("/schedules/history");
    };
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const toggleFAQ = () => setIsFAQOpen(!isFAQOpen);
    const toggleGuidelines = () => setIsGuidelinesOpen(!isGuidelinesOpen);
    const toggleContact = () => setIsContactOpen(!isContactOpen);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
                <div className="bg-gray-50 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-gray-800 font-semibold"></div>
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center text-black p-2 rounded-full transition duration-200"
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
            {/* Main Content */}
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                {isSidebarVisible && (
                    <div className="fixed top-0 left-0 w-2/3 sm:w-1/3 lg:w-1/5 h-full bg-gray-100 shadow-lg z-40">
                        <SideBar />
                    </div>
                )}

                {/* Main content */}
                <div className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarVisible ? "lg:ml-64" : ""}`}>
                    {/* Success Message */}
                    <div className="my-10 max-w-xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-green-600 mb-2">Special Collection Scheduled Successfully!</h2>
                        <p className="text-gray-600">Thank you for helping keep our community clean!</p>
                    </div>

                    {/* View History Button */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={goToHistory}
                            className="bg-green-500 text-white py-2 px-8 rounded-full text-sm sm:text-base hover:bg-green-600 transition duration-300"
                        >
                            View History
                        </button>
                    </div>

                    {/* FAQs Section */}
                    <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-4 mb-4 mx-auto">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-green-600" onClick={toggleFAQ}>
                            Frequently Asked Questions {isFAQOpen ? '▲' : '▼'}
                        </h3>
                        {isFAQOpen && (
                            <ul className="mt-2 space-y-2 text-gray-700">
                                <li>Q: What items can be collected?</li>
                                <li>A: We collect a variety of items including e-waste, bulky items, and yard waste.</li>
                                <li>Q: How do I schedule a collection?</li>
                                <li>A: You can schedule a collection through our scheduling page.</li>
                                <li>Q: Is there a fee for the special collection?</li>
                                <li>A: No, special collections are provided free of charge.</li>
                            </ul>
                        )}
                    </div>

                    {/* Guidelines Section */}
                    <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-4 mb-4 mx-auto">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-green-600" onClick={toggleGuidelines}>
                            Guidelines for Preparing Specific Types of Waste {isGuidelinesOpen ? '▲' : '▼'}
                        </h3>
                        {isGuidelinesOpen && (
                            <ul className="mt-2 space-y-2 text-gray-700">
                                <li>• Ensure all electronic devices are emptied of personal data.</li>
                                <li>• Bundle yard waste in biodegradable bags.</li>
                                <li>• For bulky items, please indicate if they are in good condition for donation.</li>
                            </ul>
                        )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-4 mb-4 mx-auto">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-green-600" onClick={toggleContact}>
                            Contact Information {isContactOpen ? '▲' : '▼'}
                        </h3>
                        {isContactOpen && (
                            <div className="mt-2 text-gray-700">
                                <p>If you need assistance with scheduling or rescheduling collections, please contact us:</p>
                                <p>Email: <a href="mailto:support@wastecollection.com" className="text-blue-500">support@wastecollection.com</a></p>
                                <p>Phone: <span className="text-blue-500">(555) 123-4567</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}