import React, { useState } from 'react';
import AddShoppingCartIcon from '@assets/icons/add-shoppingcart-icon.svg?react'

interface DynamicCounterProps {
    count: number;
    onIncrement: (e: React.MouseEvent) => void;
    onDecrement: (e: React.MouseEvent) => void;
    onAddInitial: (e: React.MouseEvent) => void;
}

const DynamicCounter: React.FC<DynamicCounterProps> = ({ count, onIncrement, onDecrement, onAddInitial }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    // Iniciar el contador a 1 si estaba en 0
    const handleInitialClick = (e: React.MouseEvent) => {
        if (count === 0) {
            onAddInitial(e);
            setIsHovered(true);
        }
    };

    return (
        <div
            className={`relative flex items-center border border-gray-200 bg-white justify-center text-gray-700 rounded-full shadow-lg transition-all duration-300 ease-out overflow-hidden select-none ${
                count === 0
                    ? 'w-10 h-10 cursor-pointer'
                    : isHovered
                        ? 'w-36 h-9 cursor-default'
                        : 'w-9 h-9 cursor-pointer text-black'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleInitialClick}
        >
            <div className="flex items-center justify-center w-full h-full relative">

                {/* ESTADO INICIAL: Símbolo Más (Visible solo cuando el contador es 0) */}
                <div
                    className={`absolute flex items-center justify-center transition-opacity duration-300 ${
                        count === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                   <AddShoppingCartIcon height="20"/>
                </div>

                {/* ESTADO EXPANDIDO: Botón menos, contador y botón más (Visible al pasar el mouse y ser mayor a 0) */}
                <div
                    className={`absolute w-full px-1 flex items-center justify-between transition-opacity duration-300 ${
                        count > 0 && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <button
                        onClick={onDecrement}
                        className="w-10 h-10 flex items-center justify-center rounded-full  transition-colors focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="font-bold text-[16px] w-6 text-center">{count}</span>

                    <button
                        onClick={onIncrement}
                        className="w-10 h-10 flex items-center justify-center rounded-full  transition-colors focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* ESTADO COMPACTADO: Solo número (Visible cuando NO hay hover y es mayor a 0) */}
                <div
                    className={`absolute flex items-center justify-center transition-opacity duration-300 ${
                        count > 0 && !isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <span className="font-bold text-[16px]">{count}</span>
                </div>

            </div>
        </div>
    );
};

export default DynamicCounter;