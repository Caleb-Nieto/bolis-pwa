import { useState } from 'react';
import DynamicCounter from './DynamicCounter';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice';
import type { RootState } from '../../store';
import type { Boli } from '../../store/bolisApi';
import { useUpdateBoliMutation, useGetBoliCategoriesQuery } from '../../store/bolisApi';
import toast from "react-hot-toast";

interface ProductCardProps {
    boli: Boli;
}

export default function ProductCard({ boli }: ProductCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [addStock, setAddStock] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: categories = [] } = useGetBoliCategoriesQuery();

    const dispatch = useDispatch();
    const boliId = boli.boliId;
    const cartItem = useSelector((state: RootState) => state.cart.cart.find(item => item.id === boliId));
    const storeProduct = useSelector((state: RootState) => state.cart.products.find(p => p.id === boliId));
    const quantity = cartItem ? cartItem.quantity : 0;

    // Displayed stock = server stock - what's already in cart (tracked in storeProduct)
    const boliStock = boli.stockQuantity;
    const displayedStock = storeProduct ? storeProduct.stock : boliStock;

    const [updateBoli] = useUpdateBoliMutation();

    const handleAddInitial = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addToCart({
            id: boliId,
            flavour: boli.flavour,
            base: boli.category?.category ?? '',
            stock: boliStock,
            price: boli.category?.price ?? 0,
        }));
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addToCart({
            id: boliId,
            flavour: boli.flavour,
            base: boli.category?.category ??  '',
            stock: boliStock,
            price: boli.category?.price ?? 0,
        }));
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(removeFromCart(boliId));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const stockToAdd = Number(data.get('addStock') ?? 0);
        
        const flavourInput = data.get('flavour') as string;
        const categoryIdInput = data.get('categoryId');

        setIsSubmitting(true);
        try {
            await updateBoli({
                id: boliId,
                flavour: flavourInput,
                categoryId: categoryIdInput ? Number(categoryIdInput) : undefined,
                addToStock: stockToAdd,
            }).unwrap();
            setAddStock('');
            setIsEditing(false);
            toast.success('¡Se actualizó correctemante!',{duration: 4000, position: 'bottom-center'})
        } catch {
            toast.error('Ocurrió un error al actualizar',{duration: 4000, position: 'bottom-center'})
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEditing) {
        return (
            <div className="relative flex flex-col border border-gray-200 bg-white rounded-xl p-4 gap-3 w-full shadow-md transition-all">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">Editar producto</h3>
                    <button
                        type="button"
                        onClick={() => { setIsEditing(false); setAddStock(''); }}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                        Cancelar
                    </button>
                </div>

                <form className="w-full flex gap-3 flex-col" onSubmit={handleUpdate}>
                    {/* Flavour & Category (Editable) */}
                    <div className="flex flex-col gap-2">
                        <input
                            name="flavour"
                            defaultValue={boli.flavour}
                            placeholder="Sabor"
                            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"
                            required
                        />
                        <div className="relative w-full">
                            <select
                                name="categoryId"
                                defaultValue={boli.category?.boliCategoryId ?? ''}
                                className="w-full h-10 text-sm appearance-none px-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"
                                required
                            >
                                <option value="" disabled>Ingrediente base</option>
                                {categories.map(cat => (
                                    <option key={cat.boliCategoryId} value={cat.boliCategoryId}>
                                        {cat.category.toLocaleUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Read-only: current stock */}
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-xs text-gray-500">Stock actual</p>
                            <div className="h-10 px-3 text-sm flex items-center border border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-medium">
                                {boliStock} unid.
                            </div>
                        </div>

                        {/* Input: stock to add */}
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-xs text-gray-500">Agregar stock</p>
                            <input
                                name="addStock"
                                value={addStock}
                                onChange={e => setAddStock(e.target.value)}
                                placeholder="0"
                                type="number"
                                min="0"
                                className="w-full h-10 text-sm px-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-1 w-full h-10 text-sm flex items-center justify-center rounded-xl bg-gray-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="relative flex border border-gray-200 bg-white rounded-xl p-4 gap-3 w-full items-center shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col gap-2 w-full cursor-pointer" onClick={() => setIsEditing(true)}>
                <p className="text-[16px] text-gray-900 font-medium group-hover:text-gray-600 transition-colors">
                    {boli.flavour}
                </p>
                <div className="border border-gray-200 rounded-full bg-gray-50 flex items-center px-2 py-0.5 max-w-max max-h-max">
                    <p className="text-gray-500 text-[11px] font-medium tracking-wide">
                        {(boli.category?.category?? '').toLocaleUpperCase()}
                    </p>
                </div>
            </div>

            <div className="flex flex-col text-right cursor-pointer" onClick={() => setIsEditing(true)}>
                <p className="text-[13px] text-gray-500">Disponibles</p>
                <p className="text-[16px] font-medium text-gray-900">{displayedStock}</p>
            </div>

            <div className="absolute right-1 -top-4 flex flex-col">
                <DynamicCounter
                    count={quantity}
                    onAddInitial={handleAddInitial}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                />
            </div>
        </div>
    );
}
