import Navbar from "@components/layout/Navbar.tsx";
import {Outlet} from "react-router-dom";

export default function MainLayout() {
    return(
        <div className="relative
        border border-black
        min-h-dvh w-screen px-5 py-10
        bg-linear-to-b from-black via-sky-950 to-white">

            <Outlet />

            <nav className="fixed bottom-8 flex w-screen items-center">
                <div className="mx-auto">
                    <Navbar/>
                </div>
            </nav>
        </div>
    )
}