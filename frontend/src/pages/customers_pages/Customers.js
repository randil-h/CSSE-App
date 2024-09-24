import Navbar from "../../components/utility/Navbar";
import SideBar from "../../components/utility/SideBar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";

const breadcrumbItems = [
    { name: 'Customers', href: '/customers/home' },
];

export default function Customers() {
    return (
        <div className="">
            {/* Navbar */}
            <div className="sticky top-0 z-10">
                <Navbar/>
            </div>
            <div className="">
                <div className="grid sm:grid-cols-6 ">
                    <div className="col-span-1 sticky left-0 top-0">
                        <SideBar/>
                    </div>
                    <div className="w-full col-span-5 flex flex-col ">
                        <div className="flex flex-row ">
                            <BackButton/>
                            <Breadcrumb items={breadcrumbItems}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};