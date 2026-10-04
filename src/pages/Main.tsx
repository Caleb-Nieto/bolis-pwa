import FilterIcon from '@assets/icons/filter-icon.svg?react'
import VaulDrawer from "@components/ui/VaulDrawer.tsx";
import ProductCard from "@components/ui/ProductCard.tsx";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../store/cartSlice';
import type { RootState } from '../store';

export default function Main() {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.cart.products);

    useEffect(() => {
        const bolis = [
            {id: 1, flavour: 'Mazapán', base: 'Leche', stock: 5, price: 17, },
            {id: 3, flavour: 'Jamaica con arandanos', base: 'Agua', stock: 3, price: 17, },
            {id: 4, flavour: 'Rompope', base: 'Leche', stock: 10, price: 17, },
            {id: 8, flavour: 'Mango con chile', base: 'Agua', stock: 1, price: 17, },
        ];
        // This will only set if products are empty in the store
        dispatch(setProducts(bolis));
    }, [dispatch]);
    
    return (
        <div className="relative flex flex-col gap-6">
            <section className="flex gap-3">
                <button className="w-12 h-12 flex justify-center items-center rounded-full border border-gray-200 shadow-sm bg-white transition-colors active:bg-gray-50">
                    <FilterIcon height="20" />
                </button>
                <div className="flex-1 relative">
                    <input placeholder="Buscar producto..." className="border border-gray-200 shadow-sm bg-white
                    h-12 px-4 flex items-center rounded-full w-full outline-none focus:border-gray-300 transition-colors"/>
                </div>
                <VaulDrawer />
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                {products.map(boli =>
                    <ProductCard key={boli.id} boli={boli} />
                )}
            </section>
        </div>
    );
}