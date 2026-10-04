import FilterIcon from '@assets/icons/filter-icon.svg?react'
import VaulDrawer from "@components/ui/VaulDrawer.tsx";
import ProductCard from "@components/ui/ProductCard.tsx";

interface Boli{
    id: number,
    flavour: string,
    base: string,
    stock: string,
    price: string,
}

export default function Main() {
    const bolis: Boli[] = [
        {id: 1, flavour: 'Mazapán', base: 'Leche', stock: '5', price: '17', },
        {id: 3, flavour: 'Jamaica con arandanos', base: 'Agua', stock: '3', price: '17', },
        {id: 4, flavour: 'Rompope', base: 'Leche', stock: '10', price: '17', },
        {id: 8, flavour: 'Mango con chile', base: 'Agua', stock: '1', price: '17', },
    ]
    
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
                {bolis.map(boli =>
                    <ProductCard key={boli.id} boli={boli} />
                )}
            </section>
        </div>
    );
}