import React, { useState } from 'react';
import TrashIcon from '@assets/icons/trash-icon.svg?react';

interface TrashCounterProps {
    count: number;
    onIncrement: (e: React.MouseEvent) => void;
    onDecrement: (e: React.MouseEvent) => void;
}

/**
 * Variante del DynamicCounter para el carrito.
 * Estado compacto: muestra el bote de basura + número.
 * Estado expandido (hover / tap): muestra -, número, +.
 * Fondo rojo degradado en escala de grises.
 */
const TrashCounter: React.FC<TrashCounterProps> = ({ count, onIncrement, onDecrement }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleTrashClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (count === 1) {
            // Solo un ítem → eliminar directo sin expandir
            onDecrement(e);
        } else {
            setIsExpanded(true);
        }
    };

    return (
        <div
            className={`relative flex items-center justify-center bg-red-900/80 text-white rounded-full shadow-md transition-all duration-300 ease-out overflow-hidden select-none cursor-pointer ${
                isExpanded ? 'w-28 h-9' : 'w-14 h-9'
            }`}
            onMouseEnter={() => count > 1 && setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex items-center justify-center w-full h-full relative">

                {/* ESTADO COMPACTO: bote de basura + número */}
                <div
                    className={`absolute flex items-center gap-1 transition-opacity duration-200 ${
                        !isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={handleTrashClick}
                >
                    <TrashIcon height="16" />
                </div>

                {/* ESTADO EXPANDIDO: menos, número, más */}
                <div
                    className={`absolute w-full px-1 flex items-center justify-between transition-opacity duration-200 ${
                        isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); onDecrement(e); if (count <= 1) setIsExpanded(false); }}
                        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors focus:outline-none active:bg-red-800"
                    >
                        {count === 1
                            ? <TrashIcon height="14" />
                            : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                            )
                        }
                    </button>

                    <span className="font-bold text-[15px] w-5 text-center">{count}</span>

                    <button
                        onClick={(e) => { e.stopPropagation(); onIncrement(e); }}
                        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors focus:outline-none active:bg-red-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TrashCounter;
