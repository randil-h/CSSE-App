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
                <div className="bg-green-100 w-full h-12 flex items-center justify-between px-4">
                    <div className="text-lg font-semibold text-gray-700">Special Collection Confirmation</div>
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
                <div className={`flex-1 p-6 transition-all duration-300 ease-in-out ${isSidebarVisible ? "lg:ml-64" : ""}`}>
                    {/* Success Message */}
                    <div className="my-10 max-w-xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-green-600 mb-4">Collection Scheduled Successfully!</h2>
                        <p className="text-gray-600 text-lg">Thank you for helping keep our community clean!</p>
                    </div>

                    {/* View History Button */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={goToHistory}
                            className="bg-black text-white py-3 px-12 rounded-full text-base hover:bg-gray-900 transition duration-300"
                        >
                            View History
                        </button>
                    </div>

                    {/* FAQs Section */}
                    <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mb-6 mx-auto">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-green-600" onClick={toggleFAQ}>
                            Frequently Asked Questions {isFAQOpen ? '▲' : '▼'}
                        </h3>
                        {isFAQOpen && (
                            <ul className="mt-4 space-y-2 text-gray-700 leading-relaxed text-left">
                                <li className="font-bold"><strong>Q:</strong> What items can be collected?</li>
                                <li ><strong>A:</strong> We collect a variety of items including e-waste, bulky items, and yard waste.</li>
                                <li className="font-bold"><strong>Q:</strong> How do I schedule a collection?</li>
                                <li><strong>A:</strong> You can schedule a collection through our scheduling page.</li>
                                <li className="font-bold"><strong>Q:</strong> Is there a fee for the special collection?</li>
                                <li><strong>A:</strong> No, special collections are provided free of charge.</li>
                            </ul>
                        )}
                    </div>

                    {/* Guidelines Section */}
                    <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mb-6 mx-auto">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-green-600" onClick={toggleGuidelines}>
                            Guidelines for Waste Preparation {isGuidelinesOpen ? '▲' : '▼'}
                        </h3>
                        {isGuidelinesOpen && (
                            <ul className="mt-4 space-y-2 text-gray-700 leading-relaxed text-left">
                                <li>• Ensure all electronic devices are emptied of personal data.</li>
                                <li>• Bundle yard waste in biodegradable bags.</li>
                                <li>• For bulky items, please indicate if they are in good condition for donation.</li>
                            </ul>
                        )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mb-6 mx-auto">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-green-600" onClick={toggleContact}>
                            Contact Information {isContactOpen ? '▲' : '▼'}
                        </h3>
                        {isContactOpen && (
                            <div className="mt-4 text-gray-700">
                                <p>If you need assistance with scheduling or rescheduling collections, please contact us:</p>
                                <p>Email: <a href="mailto:support@wastecollection.com" className="text-blue-500 hover:underline">support@wastecollection.com</a></p>
                                <p>Phone: <span className="text-blue-500">(555) 123-4567</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}