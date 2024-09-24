import React from "react";

const LoadingAnimation = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            {/* Centering container */}
            <div className="flex justify-center items-center w-64 h-64">
                {/* Image */}
                <img src="/E.gif" alt="Loading" className="w-full h-auto" />
            </div>
        </div>
    );
};

export default LoadingAnimation;
