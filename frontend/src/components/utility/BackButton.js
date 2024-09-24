import { useNavigate } from 'react-router-dom';
import {ArrowUturnLeftIcon, InformationCircleIcon} from '@heroicons/react/24/outline';

const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Go back one step in history
    };

    return (
        <div className='flex pl-8 py-4'>
            <button onClick={goBack}
                    className="font-medium text-blue-600 ">
                <ArrowUturnLeftIcon
                    className="h-6 w-6 flex-none bg-gray-300 p-1 rounded-full text-gray-800 hover:bg-gray-500"
                    aria-hidden="true"/>
            </button>
        </div>
    );
};

export default BackButton;
