import React from 'react';

const Modal = ({ isOpen, onClose, item }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <h3 className="text-lg font-bold text-center mb-4">Schedule Details</h3>
                <div className="space-y-2">
                    <p className="text-gray-700 text-left">
                        <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-left">
                        <strong>Time:</strong> {item.time}
                    </p>
                    <p className="text-gray-700 text-left">
                        <strong>Status:</strong> <span
                        className={item.status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}>{item.status === 'Cancelled' ? 'Cancelled' : 'Completed'}</span>
                    </p>
                    <p className="text-gray-700 text-left">
                        <strong>Waste Type:</strong> {item.wasteType}
                    </p>
                    <p className="text-gray-700 text-left">
                        <strong>Location:</strong> {item.location || 'N/A'}
                    </p>
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-black hover:bg-gray-400 text-white py-2 px-4 rounded-full transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
