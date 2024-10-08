import {XMarkIcon} from '@heroicons/react/20/solid'
import {useState} from "react";

export default function LandingPageBanner() {

    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null; // Render nothing if isVisible is false
    }
    return (
        <div
            className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
            <div
                className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2  -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
            >
                <div
                    className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-yellow-600 to-sky-600 opacity-30"
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                />
            </div>
            <div
                className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2  -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
            >
                <div
                    className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-sky-600 to-yellow-600
                     opacity-30"
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-gray-900">
                    <strong className="font-semibold">Dambulla Economic Center</strong>
                    <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                        <circle cx={1} cy={1} r={1}/>
                    </svg>
                    View current prices of fresh fruits and vegetables.
                </p>
                <a
                    href="https://www.facebook.com/people/%E0%B6%AF%E0%B6%B9%E0%B7%94%E0%B6%BD%E0%B7%8A%E0%B6%BD-%E0%B7%80%E0%B7%92%E0%B7%81%E0%B7%9A%E0%B7%82%E0%B7%92%E0%B6%AD-%E0%B6%86%E0%B6%BB%E0%B7%8A%E0%B6%AE%E0%B7%92%E0%B6%9A-%E0%B6%B8%E0%B6%B0%E0%B7%8A%E0%B6%BA%E0%B7%83%E0%B7%8A%E0%B6%AE%E0%B7%8F%E0%B6%B1%E0%B6%BA-Dambulla-Dedicated-Economic-Centre/100027588023825/"
                    target="_blank"
                    className="z-30 flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                    View now <span aria-hidden="true">&rarr;</span>
                </a>
            </div>
            <div className="flex flex-1 justify-end">
                <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={handleDismiss}>
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5 text-gray-900 hover:text-red-500" aria-hidden="true"/>
                </button>
            </div>
        </div>
    )
}
