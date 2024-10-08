import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import { useState } from 'react';

export default function SpecialCollectionConfirmation() {
    const navigate = useNavigate();
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const goToHistory = () => {
        navigate("/schedules/history");
    };

    const toggleFAQ = () => setIsFAQOpen(!isFAQOpen);
    const toggleGuidelines = () => setIsGuidelinesOpen(!isGuidelinesOpen);
    const toggleContact = () => setIsContactOpen(!isContactOpen);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* Sidebar */}
                <div className="sm:w-1/5 sticky top-0">
                    <SideBar />
                </div>

                {/* Main content */}
                <div className="w-full sm:w-4/5 flex flex-col p-6 items-center text-center">
                    <BackButton />

                    {/* Success Message */}
                    <div className="my-8">
                        <div className="w-28 h-28 mx-auto mb-4">
                            {/* You can add an image or icon here */}
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Special Collection Scheduled Successfully!</h2>
                        <p>Thank you for helping keep our community clean!</p>
                    </div>

                    {/* View History Button */}
                    <button onClick={goToHistory} className="bg-green-500 text-white py-2 px-8 rounded-full text-sm sm:text-base hover:bg-green-600 transition duration-300 mb-6">
                        View History
                    </button>

                    {/* FAQs Section */}
                    <div className="w-full bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-semibold cursor-pointer" onClick={toggleFAQ}>
                            Frequently Asked Questions {isFAQOpen ? '▲' : '▼'}
                        </h3>
                        {isFAQOpen && (
                            <ul className="mt-2 space-y-2">
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
                    <div className="w-full bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-semibold cursor-pointer" onClick={toggleGuidelines}>
                            Guidelines for Preparing Specific Types of Waste {isGuidelinesOpen ? '▲' : '▼'}
                        </h3>
                        {isGuidelinesOpen && (
                            <ul className="mt-2 space-y-2">
                                <li>• Ensure all electronic devices are emptied of personal data.</li>
                                <li>• Bundle yard waste in biodegradable bags.</li>
                                <li>• For bulky items, please indicate if they are in good condition for donation.</li>
                            </ul>
                        )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="w-full bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-semibold cursor-pointer" onClick={toggleContact}>
                            Contact Information {isContactOpen ? '▲' : '▼'}
                        </h3>
                        {isContactOpen && (
                            <div className="mt-2">
                                <p>If you need assistance with scheduling or rescheduling collections, please contact us:</p>
                                <p>Email: support@wastecollection.com</p>
                                <p>Phone: (555) 123-4567</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
