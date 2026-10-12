import Navbar from "@components/layout/Navbar.tsx";
import FlyToCartOverlay from "@components/ui/FlyToCartOverlay.tsx";
import {Outlet} from "react-router-dom";

export default function MainLayout() {
    return(
        <div className="relative min-h-dvh bg-[#F7F7F7]">
            <FlyToCartOverlay />
            <section className="relative w-screen pt-1">
                <Outlet />
            </section>
            <nav className="fixed bottom-6 flex w-screen items-center">
                <div className="mx-auto">
                    <Navbar/>
                </div>
            </nav>
        </div>
    )
}