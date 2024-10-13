import { Link } from "react-router-dom";

export default function Welcome_banner() {
  return (
    <div className="relative">

      {/* Background with blur */}
      <div
        className="absolute -inset-6 bg-cover bg-center filter blur-md -z-10"
        style={{ backgroundImage: "url('bins.jpg')" }}
      ></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center py-32 px-12 gap-3">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-black ring-1 ring-gray-400 hover:ring-sky-600">
            Visit BINN La Den for an unforgettable experience{' '}
            <Link to="/tourism" className="font-semibold text-sky-700">
              <span className="absolute inset-0" aria-hidden="true" />
              Visit Us <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="text-6xl text-white font-semibold mb-4"><span className="text-sky-200">BINN</span> Collections</div>
        <p className="text-lg md:text-xl max-w-3xl text-white text-center mb-6">
          Nestled in Nikaweratiya, Sri Lanka, our multi-crop plantation offers an enticing variety of premium products, inviting you to savor the rich flavors of our land.
        </p>

        <div className="flex items-center justify-center gap-x-6">
          <Link
            to="/dashboard"
            className="ring-1 ring-sky-500 text-white px-8 py-1 rounded-full font-semibold text-base transition duration-300 hover:bg-sky-500"
          >
            Dashboard
          </Link>
          <Link
            to="/registration"
            className="bg-black text-white px-8 py-1 rounded-full font-semibold text-base transition duration-300 hover:bg-sky-500" >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
