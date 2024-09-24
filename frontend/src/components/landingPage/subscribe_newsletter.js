import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'

export default function Subscribe_newsletter() {
    return (
        <div className=" bg-lime-100 py-6 sm:py-24 lg:py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8  lg:max-w-none lg:grid-cols-2">
                    <div className="max-w-xl lg:max-w-lg gap-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">Subscribe to our newsletter.</h2>
                        <p className="mt-2 text-base leading-8 text-gray-800">
                            Sign up to receive weekly updates of product postings and news from Kunumahana.
                        </p>
                        <div className="mt-2 flex max-w-md gap-x-4">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="min-w-0 flex-auto rounded-full border-0 bg-white px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-lime-500 sm:text-sm sm:leading-6"
                                placeholder="Enter your email"
                            />
                            <button
                                type="submit"
                                className="flex-none rounded-full bg-emerald-900 px-3.5 py-2.5 text-sm font-semibold text-gray-200 shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                        <div className="flex flex-col items-start">
                            <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                <CalendarDaysIcon className="h-6 w-6 text-gray-800" aria-hidden="true" />
                            </div>
                            <dt className="mt-4 font-semibold text-gray-900">Weekly updates</dt>
                            <dd className="mt-2 leading-7 text-gray-800">
                                You will receive notifications when we post a new product.
                            </dd>
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                <HandRaisedIcon className="h-6 w-6 text-gray-800" aria-hidden="true" />
                            </div>
                            <dt className="mt-4 font-semibold text-gray-900">No spam</dt>
                            <dd className="mt-2 leading-7 text-gray-800">
                                No Spam guarantee to ensure your inbox wont fill up.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

        </div>
    )
}