import { useEffect, useRef, useState } from 'react';
import HouseIcon from '@assets/icons/house-icon.svg?react';
import HouseIconFill from '@assets/icons/house-icon-fill.svg?react';
import ShoppingCartIcon from '@assets/icons/shoppingcart-icon.svg?react';
import ShoppingCartIconFill from '@assets/icons/shoppingcart-icon-fill.svg?react';
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { motion, useAnimationControls } from 'framer-motion';

export default function Navbar() {
    const location = useLocation();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    const controls = useAnimationControls();
    const cartBounceControls = useAnimationControls();
    const [isCartImpacting, setIsCartImpacting] = useState(false);
    const isFirstMount = useRef(true);
    const prevPathRef = useRef(location.pathname);

    // Escuchar el impacto de la gota que cae desde el producto
    useEffect(() => {
        const onCartImpact = () => {
            setIsCartImpacting(true);
            cartBounceControls.start({
                scale: [1, 1.32, 0.9, 1.1, 1],
                transition: { duration: 0.42, ease: "easeOut" }
            });
            setTimeout(() => setIsCartImpacting(false), 500);
        };

        window.addEventListener('cart-impact', onCartImpact);
        return () => window.removeEventListener('cart-impact', onCartImpact);
    }, [cartBounceControls]);

    // Calculamos la posición:
    // w-16 = 64px, gap-5 = 20px -> Cada salto es de 84px
    const getPillX = () => {
        switch (location.pathname) {
            case '/main':
                return 0;
            case '/basket':
                return 84;
            case '/new-register':
                return 168;
            default:
                return 0;
        }
    };

    const isTabActive = ['/main', '/basket', '/new-register'].includes(location.pathname);

    useEffect(() => {
        const targetX = getPillX();

        if (isFirstMount.current) {
            isFirstMount.current = false;
            controls.set({
                x: targetX,
                opacity: isTabActive ? 1 : 0,
                scale: 1,
            });
            return;
        }

        if (prevPathRef.current === location.pathname) {
            return;
        }

        prevPathRef.current = location.pathname;

        // Animación de posición y escala con rebote tipo iOS al cambiar de pestaña
        controls.start({
            x: targetX,
            opacity: isTabActive ? 1 : 0,
            scale: [1, 0.88, 1.06, 1],
            transition: {
                x: { type: "spring", stiffness: 380, damping: 26 },
                scale: { duration: 0.32, ease: [0.34, 1.56, 0.64, 1] },
                opacity: { duration: 0.2 },
            },
        });
    }, [location.pathname, isTabActive, controls]);

    return (
        // Contenedor principal del navbar
        <div className="relative flex bg-white/10 backdrop-blur-sm rounded-full shadow-lg p-2 gap-5 w-min">
            {/* Fondo deslizante absoluto con escala y transición elástica tipo iOS */}
            <motion.div
                className="absolute left-2 top-2 w-16 h-11 bg-gray-300 rounded-full z-0 pointer-events-none"
                animate={controls}
                initial={{
                    x: getPillX(),
                    opacity: isTabActive ? 1 : 0,
                    scale: 1,
                }}
            />

            <NavLink
                to="/main"
                className={({ isActive }) =>
                    `relative z-10 px-4 py-2 w-16 h-11 flex items-center justify-center rounded-full transition-colors active:scale-95 duration-150 ${
                        isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`
                }
            >
                {({ isActive }) => (
                    isActive ? <HouseIconFill height="24" /> : <HouseIcon height="24" />
                )}
            </NavLink>

            <NavLink
                to="/basket"
                id="navbar-cart-tab"
                className={({ isActive }) =>
                    `relative z-10 px-4 py-2 w-16 h-11 flex items-center justify-center rounded-full transition-colors active:scale-95 duration-150 ${
                        isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <motion.div
                            animate={cartBounceControls}
                            className="flex items-center justify-center"
                        >
                            {isActive ? <ShoppingCartIconFill height="24" /> : <ShoppingCartIcon height="24" />}
                        </motion.div>

                        {/* Efecto de onda al recibir la gota de producto */}
                        {isCartImpacting && (
                            <motion.span
                                initial={{ scale: 0.7, opacity: 0.9 }}
                                animate={{ scale: 1.7, opacity: 0 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full border-2 border-cyan-700/60 pointer-events-none"
                            />
                        )}

                        {totalQuantity > 0 && (
                            <motion.div
                                key={totalQuantity}
                                initial={{ scale: 0.4 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className="absolute right-1 top-0 z-20 min-w-6 h-6 px-1 bg-cyan-900/80 text-white flex items-center justify-center rounded-full shadow-sm pointer-events-none"
                            >
                                <p className="text-[12px] font-medium leading-none">{totalQuantity}</p>
                            </motion.div>
                        )}
                    </>
                )}
            </NavLink>
        </div>
    );
}