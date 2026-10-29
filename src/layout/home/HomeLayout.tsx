import LeftSideBar from "@/components/LeftSideBar";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSideBar";
import { Outlet } from "react-router";

export default function HomeLayout() {
    return (
        <div>
            <Navbar />

            <section className="pt-10 pb-5 px-5 dark:bg-gray-900 min-h-screen">
                <div className="md:grid grid-cols-[2fr_6fr] lg:grid-cols-[2fr_6fr_3fr] gap-4 mx-auto max-w-7xl">
                    <LeftSideBar />
                    <div className="min-w-0">
                        <Outlet />
                    </div>
                    <div className="hidden lg:block">
                        <RightSideBar />
                    </div>
                </div>
            </section>
        </div>
    );
}
