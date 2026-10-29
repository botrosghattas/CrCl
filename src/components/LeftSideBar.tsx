import { MdOutlineFeed } from "react-icons/md";
import { TbLayoutList } from "react-icons/tb";
import { RiUserCommunityLine } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router";

export default function LeftSideBar() {
    return (
        <div className="hidden md:block ">
            <div className=" border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
                <div className="flex items-center gap-2 hover:text-brand-500">
                    <MdOutlineFeed />
                    <Link to="/home">Feed</Link>
                </div>
                <div className="flex items-center gap-2 hover:text-brand-500">
                    <TbLayoutList />
                    <Link to="/my-posts">My posts</Link>
                </div>
                <div className="flex items-center gap-2 hover:text-brand-500">
                    <RiUserCommunityLine />
                    <Link to="/community">Community</Link>
                </div>
                <div className="flex items-center gap-2 hover:text-brand-500">
                    <FaRegBookmark />
                    <Link to="/saved">Saved</Link>
                </div>
            </div>
        </div>
    );
}
