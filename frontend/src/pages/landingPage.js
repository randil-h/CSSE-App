import '../index.css';
import Navbar from "../components/utility/Navbar";
import WelcomeBanner from "../components/landingPage/Welcome_banner"
import FunctionBar from "../components/landingPage/Function_bar";
import SubscribeNewsletter from "../components/landingPage/subscribe_newsletter";
import LandingPageBanner from "../components/landingPage/LandingPageBanner";
import Footer from "../components/utility/Footer";

export default function LandingPage() {
    return (
        <div>
            <Navbar/>
            <LandingPageBanner/>
            <WelcomeBanner/>
            <FunctionBar/>
            <SubscribeNewsletter/>
            <Footer/>
        </div>
    )
}