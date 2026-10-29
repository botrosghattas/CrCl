import { Link, Navigate, NavLink, useNavigate } from "react-router";
import logo from "/logo.svg";
import { AiOutlineHome } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { useContext } from "react";
import { authCreatedContext } from "@/context/AuthContext";
import { Button, Dropdown, Label, Skeleton } from "@heroui/react";
import { GoGear } from "react-icons/go";
import { IoExitOutline } from "react-icons/io5";
import type { Key } from "react-aria-components";



export default function Navbar() {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;

    

    const { updateToken, user, isUserProfilePending } = auth;

    

    const nav = useNavigate();

    function handleDropdownSelection(key: Key) {
        switch (key) {
            case "profile":
                nav("/profile");
                break;

            case "settings":
                nav("/settings");
                break;

            case "logout":
                updateToken("");
                nav("/login");
                break;
        }
    }

    return (
        <header className="antialiased sticky top-0 border-b border-b-gray-700 shadow-2xs shadow-gray-700 z-10">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center max-w-8xl mx-auto">
                    <div className="flex justify-start items-center">
                        <Link to="/home" className="flex mr-4">
                            <img
                                src={logo}
                                className="mr-3 h-8"
                                alt="CrCl Logo"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                CrCl
                            </span>
                        </Link>
                    </div>
                    <div className="flex justify-between gap-8">
                        <NavLink
                            to="/home"
                            className={`flex items-center gap-1`}
                        >
                            <AiOutlineHome />
                            <span className="hidden sm:inline">Home</span>
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={`flex items-center gap-1`}
                        >
                            <IoPersonOutline />
                            <span className="hidden sm:inline">Profile</span>
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={`flex items-center gap-1 hover:cursor-pointer`}
                        >
                            <GoGear />
                            <span className="hidden sm:inline">
                                Settings
                            </span>
                        </NavLink>
                    </div>
                    <div>
                        <Dropdown>
                            <Button className="flex items-center gap-1 bg-transparent">
                                {isUserProfilePending ? (
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8.5 w-8.5 shrink-0 rounded-full" />
                                        <Skeleton className="h-3 w-24 rounded-lg" />
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            className="rounded-full w-8.5 h-8.5"
                                            src={user?.photo}
                                            alt="user profile picture"
                                        />
                                        <span className="hidden md:inline">
                                            {user?.name}
                                        </span>
                                    </>
                                )}
                            </Button>
                            <Dropdown.Popover placement="bottom right">
                                <Dropdown.Menu
                                    onAction={(key) =>
                                        handleDropdownSelection(key)
                                    }
                                >
                                    <Dropdown.Item
                                        id="profile"
                                        textValue="profile"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <IoPersonOutline />
                                            <span>Profile</span>
                                        </Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        id="settings"
                                        textValue="settings"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <GoGear />
                                            <span>Settings</span>
                                        </Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        id="logout"
                                        textValue="logout"
                                        variant="danger"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <IoExitOutline />
                                            <span>Logout</span>
                                        </Label>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    </div>
                </div>
            </nav>
        </header>
    );
}
