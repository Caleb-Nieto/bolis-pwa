import { useState } from 'react';
import DynamicCounter from "./DynamicCounter";

interface Boli {
    id: number,
    flavour: string,
    base: string,
    stock: string,
    price: string,
}

interface ProductCardProps {
    boli: Boli;
}

export default function ProductCard({ boli }: ProductCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="relative flex flex-col border border-gray-200 bg-white rounded-xl p-4 gap-3 w-full shadow-md transition-all">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Editar producto</h3>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                        Cancelar
                    </button>
                </div>
                <form className="w-full flex gap-3 flex-col" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
                    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50">
                        <input defaultValue={boli.flavour} placeholder="Sabor" className="h-10 px-3 text-sm border-b border-gray-200 bg-transparent outline-none focus:bg-white transition-colors"/>
                        <div className="relative w-full">
                            <select
                                defaultValue={boli.base}
                                className="w-full h-10 text-sm appearance-none px-3 bg-transparent outline-none focus:bg-white transition-colors">
                                <option value="" disabled>Ingrediente base</option>
                                <option value="Agua">Agua</option>
                                <option value="Leche">Leche</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <input defaultValue={boli.price} placeholder="Precio" type="number" className="w-full h-10 text-sm px-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"/>
                        <input defaultValue={boli.stock} placeholder="Cantidad" type="number" className="w-full h-10 text-sm px-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"/>
                    </div>

                    <button 
                        type="submit" 
                        className="mt-1 w-full h-10 text-sm flex items-center justify-center rounded-xl bg-gray-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] active:bg-gray-800"
                    >
                        Actualizar
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="relative flex border border-gray-200 bg-white rounded-xl p-4 gap-3 w-full items-center shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col gap-2 w-full cursor-pointer" onClick={() => setIsEditing(true)}>
                <p className="text-[16px] text-gray-900 font-medium group-hover:text-gray-600 transition-colors">{boli.flavour}</p>
                <div className="border border-gray-200 rounded-full bg-gray-50 flex items-center px-2 py-0.5 max-w-max max-h-max">
                    <p className="text-gray-500 text-[11px] font-medium tracking-wide">{boli.base.toLocaleUpperCase()}</p>
                </div>
            </div>
            <div className="flex flex-col text-right cursor-pointer" onClick={() => setIsEditing(true)}>
                <p className="text-[13px] text-gray-500">Disponibles</p>
                <p className="text-[16px] font-medium text-gray-900">{boli.stock}</p>
            </div>

            <div className="absolute right-1 -top-4 flex flex-col">
                <DynamicCounter/>
            </div>
        </div>
    );
}
