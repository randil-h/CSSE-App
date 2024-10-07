import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";

export default function SpecialCollectionConfirmation() {
    const navigate = useNavigate();

    const goToHistory = () => {
        navigate("/schedules/history");
    };

    return (
        <div className="min-h-screen flex flex-col">
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

                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Special Collection Scheduled Successfully!</h2>
                        <p>Thank you for helping keep our community clean!</p>
                    </div>

                    {/* View History Button */}
                    <button onClick={goToHistory} className="bg-green-500 text-white py-2 px-8 rounded-full text-sm sm:text-base hover:bg-green-600 transition duration-300">
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
}
