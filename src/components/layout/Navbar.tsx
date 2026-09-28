import StoreFrontIcon from '@assets/icons/storefront-icon.svg?react'
import AddBoliIcon from '@assets/icons/add-register.svg?react'
import BasketIcon from '@assets/icons/basket-icon.svg?react'
import {NavLink} from "react-router-dom";

export default function Navbar() {
    return (
        <div className="flex bg-white/10 backdrop-blur-sm rounded-full shadow-lg
            p-2 gap-5 size-min">
            <NavLink to="/main" className={({isActive}) =>
            `px-4 py-2 w-16 h-11 flex "items-center justify-center rounded-full transition-colors
            ${isActive? 'bg-black text-white':'text-black'}`}>
                <StoreFrontIcon width="30" height="30"/>
            </NavLink>
            <NavLink to="/basket" className={({isActive}) =>
                `px-4 py-2 w-16 h-11 flex "items-center justify-center rounded-full transition-colors
            ${isActive? 'bg-black text-white':'text-black'}`}>
                <BasketIcon width="30" height="30"/>
            </NavLink>
            <NavLink to="/new-register" className={({isActive}) =>
                `px-4 py-2 w-16 h-11 flex "items-center justify-center rounded-full transition-colors
            ${isActive? 'bg-black text-white':'text-black'}`}>
                <AddBoliIcon width="30" height="30"/>
            </NavLink>
        </div>
    );
}