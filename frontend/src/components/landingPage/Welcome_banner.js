import {Link} from "react-router-dom";

export default function Welcome_banner(){
    return (
        <div className="bg-cover bg-center "  style={{backgroundImage: "url('garbage.jpg')"}}>

            {/* Content container */}
            <div className="relative  flex flex-col items-center justify-center py-32 gap-3">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white ring-1 ring-gray-400 hover:ring-lime-600">
                        Visit Kunumahana for an unforgettable experience{' '}
                        <Link to="/tourism" className="font-semibold text-lime-500">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Visit Us <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>
                <div className="text-6xl  text-white font-medium mb-4">Kunumahana Collections</div>
                <p className="text-lg md:text-xl max-w-3xl text-white text-center mb-6">
                    Nestled in Nikaweratiya, Sri Lanka, our multi-crop plantation offers an enticing variety of premium products, inviting you to savor the rich flavors of our land.
                </p>

                <div className=" flex items-center justify-center gap-x-6">
                    <Link to="/dashboard" className="ring-1 ring-lime-500 text-white px-8 py-1 rounded-full font-semibold text-lg transition duration-300 hover:bg-lime-500">
                        View Dashboard
                    </Link>
                    <button className="bg-black text-white px-8 py-1 rounded-full font-semibold text-lg transition duration-300 hover:bg-lime-500">
                        Learn More
                    </button>
                </div>

            </div>
        </div>
    );
};

