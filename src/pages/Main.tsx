import OptionsIcon from '@assets/icons/options-icon.svg?react';
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
    const [filterOption, setFilterOption] = useState<'none' | 'low-stock' | 'agua' | 'leche'>('none');
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

    const handleCopyFlavours = () => {
        const text = bolis.map(b => b.flavour).join('\n');
        navigator.clipboard.writeText(text);
        toast('Se copió al portapapeles', {icon: '📋'});
        setIsDropdownOpen(false);
    };
    
    // Filter and sort bolis
    const filteredBolis = bolis.filter(b => {
        const matchSearch = b.flavour.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchSearch) return false;
        
        if (filterOption === 'agua') {
            return b.category?.category?.toLowerCase() === 'agua';
        }
        if (filterOption === 'leche') {
            return b.category?.category?.toLowerCase() === 'leche';
        }
        return true;
    }).sort((a, b) => {
        if (filterOption === 'low-stock') {
            return a.stockQuantity - b.stockQuantity;
        }
        return 0;
    });

    return (
        <div className="flex flex-col gap-5">
            <section className="sticky top-0 z-10 flex h-16 rounded-full bg-white/20 backdrop-blur-sm items-center p-2 w-full">
                <div className="w-full relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-11 h-11 flex justify-center items-center rounded-full border border-gray-200 shadow-sm bg-white transition-colors active:bg-gray-50 active:scale-95"
                    >
                        <OptionsIcon height="20" />
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
                                <button 
                                    onClick={handleCopyFlavours}
                                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
                                >
                                    Copiar lista de sabores
                                </button>
                                <div className="h-px bg-gray-100 my-1 mx-2" />
                                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Filtrar
                                </div>
                                <button 
                                    onClick={() => { setFilterOption(filterOption === 'low-stock' ? 'none' : 'low-stock'); setIsDropdownOpen(false); }}
                                    className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${filterOption === 'low-stock' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Poco stock
                                    {filterOption === 'low-stock' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                </button>
                                <button 
                                    onClick={() => { setFilterOption(filterOption === 'agua' ? 'none' : 'agua'); setIsDropdownOpen(false); }}
                                    className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${filterOption === 'agua' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    De agua
                                    {filterOption === 'agua' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                </button>
                                <button 
                                    onClick={() => { setFilterOption(filterOption === 'leche' ? 'none' : 'leche'); setIsDropdownOpen(false); }}
                                    className={`text-left px-3 py-2 text-sm rounded-xl transition-colors active:bg-gray-100 flex justify-between items-center ${filterOption === 'leche' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    De leche
                                    {filterOption === 'leche' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="w-full">
                    <p className="text-[16px]">Inventario</p>
                </div>
                <div className="mx-auto">
                    <VaulDrawer />
                </div>
            </section>
            <div className="flex-1 relative">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="border border-gray-200 shadow-sm bg-white h-11 px-4 flex items-center rounded-full w-full outline-none focus:border-gray-300 transition-colors"
                />
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
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                    {filteredBolis.map(b => (
                        <ProductCard key={b.boliId} boli={b} />
                    ))}
                </section>
            )}
            <div className='h-24'></div>
        </div>
    );
}