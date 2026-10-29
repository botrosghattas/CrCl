import hero from "../../assets/images/hero.png"
import logo from "/logo.svg"

export default function Hero() {
    return (
        <div className="hidden lg:block w-1/2">
            <h1 className="flex items-center mb-4">
                <img
                    src={logo}
                    alt="CrCl logo"
                    width="100px"
                    className="me-2 inline"
                />
                <span className="text-7xl font-bold font-spicy-rice">CrCl</span>
            </h1>
            <p className="text-2xl font-bold">
                CrCl is where you share, scroll, gossip, and pretend you’re not
                wasting time. Connect with friends, discover what’s happening,
                and make yourself unnecessarily available to the internet.
            </p>
            <img src={hero} alt="" />
        </div>
    );
}
