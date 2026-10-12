import SearchIcon from '@assets/icons/search-icon.svg?react';
import FadersIcon from '@assets/icons/faders-icon.svg?react';
import ClipboardIcon from '@assets/icons/clipboard-icon.svg?react';
import VaulDrawer from '@components/ui/VaulDrawer.tsx';
import ProductCard from '@components/ui/ProductCard.tsx';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../store/cartSlice';
import { useGetBolisQuery } from '../store/bolisApi';
import { AnimatePresence, motion } from 'framer-motion';
import toast from "react-hot-toast";

export default function Main() {
    const dispatch = useDispatch();
    const { data: bolis = [], isLoading, isError } = useGetBolisQuery();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortStock, setSortStock] = useState<'none' | 'asc' | 'desc'>('none');
    const [filterCategory, setFilterCategory] = useState<'none' | 'agua' | 'leche'>('none');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Sync RTK Query data into the local cart products slice so stock tracking works
    useEffect(() => {
        if (bolis.length > 0) {
            const mapped = bolis.map(b => ({
                // Check multiple possible id fields from the backend
                id: b.boliId,
                flavour: b.flavour,
                base: b.category?.category ?? '',
                stock: b.stockQuantity,
                price: b.category?.price ?? 0,
            }));
            dispatch(setProducts(mapped));
        }
    }, [bolis, dispatch]);

    async function handleCopyAvailableFlavours(): Promise<boolean> {
        let text = '';

        for (let i = 0; i < bolis.length; i++) {
            const b = bolis[i];
            if (b.stockQuantity > 0) {
                text += (text ? '\n' : '') + b.flavour;
            }
        }

        try{
           await navigator.clipboard.writeText(text);
           toast('Se copió la lista al portapapeles', {icon: '📋'});
           return true;
        } catch (err){
            toast.error('Algo salio mal');
            return false;
        }
    }
    
    // Filter and sort bolis
    const filteredBolis = bolis.filter(b => {
        const matchSearch = b.flavour.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchSearch) return false;
        
        if (filterCategory === 'agua') {
            return b.category?.category?.toLowerCase() === 'agua';
        }
        if (filterCategory === 'leche') {
            return b.category?.category?.toLowerCase() === 'leche';
        }
        return true;
    }).sort((a, b) => {
        if (sortStock === 'asc') {
            return a.stockQuantity - b.stockQuantity;
        }
        if (sortStock === 'desc') {
            return b.stockQuantity - a.stockQuantity;
        }
        return 0;
    });

    return (
        <div className="flex flex-col gap-2">
            <section className="sticky top-0 z-10 flex gap-4 h-14 bg-white/20 backdrop-blur-xs px-5 py-2 w-full">
                <div className="flex w-full relative">
                    <div className="relative">
                        <span className="absolute left-2 top-3 text-gray-500" ><SearchIcon height="18"/></span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar..."
                            className="border pl-8 border-gray-200 shadow-sm bg-white h-11 px-4 flex items-center rounded-full w-full outline-none focus:border-gray-300 transition-colors"
                        /> 
                    </div>
                </div>
                <div className="flex justify-end">
                    <VaulDrawer />
                </div>
            </section>
            <div className="w-full flex gap-1 relative px-5" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-2 h-8 flex justify-center items-center rounded-full border border-gray-200 shadow-sm bg-white transition-colors active:bg-gray-50 active:scale-95"
                >
                    <FadersIcon height="18" />
                    <p className='text-[14px]'>Filtros</p>
                </button>
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-14 left-0 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 z-30"
                        >
                            <div className="h-px bg-gray-100 my-1 mx-2" />
                            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Ordenar por Stock
                            </div>
                            <button
                                onClick={() => setSortStock(sortStock === 'asc' ? 'none' : 'asc')}
                                className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${sortStock === 'asc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                Menos a más
                                {sortStock === 'asc' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                            </button>
                            <button
                                onClick={() => setSortStock(sortStock === 'desc' ? 'none' : 'desc')}
                                className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${sortStock === 'desc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                Más a menos
                                {sortStock === 'desc' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                            </button>

                            <div className="h-px bg-gray-100 my-1 mx-2" />
                            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Categoría
                            </div>
                            <button
                                onClick={() => setFilterCategory(filterCategory === 'agua' ? 'none' : 'agua')}
                                className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${filterCategory === 'agua' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                De agua
                                {filterCategory === 'agua' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                            </button>
                            <button
                                onClick={() => setFilterCategory(filterCategory === 'leche' ? 'none' : 'leche')}
                                className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${filterCategory === 'leche' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                De leche
                                {filterCategory === 'leche' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={handleCopyAvailableFlavours}
                    className="px-2 h-8 flex justify-center items-center rounded-full border border-gray-200 shadow-sm bg-white transition-colors active:bg-gray-50 active:scale-95"
                >
                    <ClipboardIcon height="18"/>
                    <p className='text-[14px]'>Sabores disponibles</p>
                </button>
            </div>
            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <p className="text-gray-400 text-sm">Cargando productos...</p>
                </div>
            )}

            {isError && (
                <div className="flex justify-center items-center py-16">
                    <p className="text-red-400 text-sm">Error al cargar productos. Intenta de nuevo.</p>
                </div>
            )}

            {!isLoading && !isError && (
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6 px-5">
                    {filteredBolis.map(b => (
                        <ProductCard key={b.boliId} boli={b} />
                    ))}
                </section>
            )}
            <div className='h-24'></div>
        </div>
    );
}