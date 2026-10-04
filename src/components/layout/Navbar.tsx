import StoreFrontIcon from '@assets/icons/storefront-icon.svg?react'
import ShoppingCartIcon from '@assets/icons/shoppingCart-icon.svg?react'
import {NavLink, useLocation} from "react-router-dom";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function Navbar() {
    const location = useLocation();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    // Calculamos la posición:
    // w-16 = 64px, gap-5 = 20px -> Cada salto es de 84px
    const getPillPosition = () => {
        switch (location.pathname) {
            case '/main':
                return 'translate-x-0';
            case '/basket':
                return 'translate-x-[84px]';
            case '/new-register':
                return 'translate-x-[168px]';
            default:
                return 'opacity-0'; // Ocultar si ninguna ruta está activa
        }
    };
    return (
        // Agregamos 'relative' al contenedor padre para posicionar el fondo
        <div className="relative flex bg-white/10 backdrop-blur-sm rounded-full shadow-lg p-2 gap-5 w-min">

            {/* Fondo deslizante absoluto */}
            <div
                className={`absolute left-2 top-2 w-16 h-11 bg-gray-300 rounded-full transition-all duration-300 ease-in-out z-0 ${getPillPosition()}`}
            />

            <NavLink
                to="/main"
                className={({ isActive }) =>
                    // Eliminamos el bg-gray-300 y agregamos 'relative z-10' para que el ícono quede por encima del fondo
                    `relative z-10 px-4 py-2 w-16 h-11 flex items-center justify-center rounded-full transition-colors ${
                        isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`
                }
            >
                <StoreFrontIcon width="30" height="30"/>
            </NavLink>

            <NavLink
                to="/basket"
                className={({ isActive }) =>
                    `group is-active relative z-10 px-4 py-2 w-16 h-11 flex items-center justify-center rounded-full transition-colors ${
                        isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`
                }
            >
                <ShoppingCartIcon width="30" height="30"/>
                {totalQuantity > 0 && (
                    <div className="absolute right-1 top-0 w-6 h-6 border border-gray-300
                    bg-white flex items-center rounded-full">
                        <p className="mx-auto text-[12px] font-bold">{totalQuantity}</p>
                    </div>
                )}
            </NavLink>
        </div>
    );
}