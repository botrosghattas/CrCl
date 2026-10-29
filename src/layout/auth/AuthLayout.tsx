import logo from "/logo.svg"
import Hero from "./Hero";
import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-dvh lg:flex lg:justify-between lg:px-24 lg:py-10 lg:gap-4">
            <Hero />
            <div className="flex flex-col items-center justify-center px-6 py-8  md:min-h-screen lg:py-0 lg:w-1/2">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white lg:hidden"
                >
                    <img className="w-24 h-24 mx-auto" src={logo} alt="logo" />
                </a>
                <Outlet />
            </div>
        </section>
    );
}
