import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import TrashCounter from '../components/ui/TrashCounter';
import { addToCart, removeFromCart, clearCart } from '../store/cartSlice';
import { useCreateOrderMutation } from '../store/bolisApi';
import toast from 'react-hot-toast';

export default function ShoppingCart() {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const products = useSelector((state: RootState) => state.cart.products);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [received, setReceived] = useState<string>('');
    const [orderError, setOrderError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState('');

    const totalQuantity = cart.reduce((a, b) => a + b.quantity, 0);
    const total = cart.reduce((a, b) => a + b.quantity * b.price, 0);
    const change = Math.max(0, Number(received) - total);

    if (cart.length === 0 && !orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
                <p className="text-gray-500 text-lg font-medium">
                    Los bolis que agregues al carrito se mostraran aqui
                </p>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p className="text-gray-900 text-xl font-semibold">¡Orden confirmada!</p>
                <p className="text-gray-500 text-sm">{orderSuccess}</p>
            </div>
        );
    }

    const handleConfirmOrder = async () => {
        setOrderError('');

        // Shipping address is optional in this UI — use a placeholder or collect it
        const body = {
            shippingAddress: 'Local',
            items: cart.map(item => ({ boliId: item.id, quantity: item.quantity })),
        };

        try {
            await createOrder(body).unwrap();
            dispatch(clearCart());
            setOrderSuccess(`Orden enviada correctamente por $${total}`);
        } catch {
            setOrderError('Error al confirmar la orden. Intenta de nuevo.');
        }
    };

    const handleIncrement = (boli: any) => {
        const storeProduct = products.find(p => p.id === boli.id);
        if (!storeProduct || storeProduct.stock <= 0) {
            toast.error('No hay suficiente stock');
            return;
        }
        dispatch(addToCart(boli));
    };

    return (
        <div className="flex flex-col gap-6 px-5 pt-1">
            <h1 className="text-gray-900 text-2xl font-medium tracking-tight">Resumen de venta</h1>

            {/* Lista de productos */}
            <section className="flex flex-col gap-3">
                {cart.map(boli => (
                    <div key={boli.id} className="relative flex border border-gray-200 bg-white rounded-xl p-4 gap-3 w-full items-center shadow-sm">
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-[16px] text-gray-900 font-medium">{boli.flavour}</p>
                            <div className="border border-gray-200 rounded-full bg-gray-100 flex items-center px-2 max-w-max max-h-max">
                                <p className="text-[11px] font-medium">{boli.base}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <TrashCounter
                                count={boli.quantity}
                                onIncrement={(e) => { e.stopPropagation(); handleIncrement(boli); }}
                                onDecrement={(e) => { e.stopPropagation(); dispatch(removeFromCart(boli.id)); }}
                            />
                            <div className="flex flex-col text-right min-w-max">
                                <p className="text-[14px] text-gray-500">{boli.quantity} x ${boli.price}</p>
                                <p className="text-[16px] font-medium text-gray-900">${boli.quantity * boli.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Resumen y pago */}
            <div className="relative flex flex-col border border-gray-200 bg-gray-50 rounded-xl p-5 gap-4 w-full shadow-sm">
                <div className="flex w-full justify-between items-center">
                    <p className="text-[15px] text-gray-600">Cantidad total</p>
                    <p className="text-[15px] font-medium text-gray-900">
                        {totalQuantity} {totalQuantity > 1 ? 'unidades' : 'unidad'}
                    </p>
                </div>

                <hr className="border-gray-200 w-full" />

                <div className="flex w-full justify-between items-center">
                    <p className="text-[18px] text-gray-900 font-medium">Total a pagar</p>
                    <p className="text-[24px] text-gray-900 font-semibold">${total}</p>
                </div>

                <div className="flex w-full justify-between items-center mt-2">
                    <p className="text-[15px] text-gray-600">Recibido</p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={received}
                            onChange={e => setReceived(e.target.value)}
                            className="text-[16px] pl-7 pr-3 py-2 text-right w-28 bg-white border border-gray-200 rounded-lg shadow-sm outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex w-full justify-between items-center">
                    <p className="text-[15px] text-gray-600">Devolver</p>
                    <p className="text-[18px] text-gray-900 font-medium">${change.toFixed(2)}</p>
                </div>
            </div>

            {orderError && (
                <p className="text-center text-sm text-red-500 font-medium">{orderError}</p>
            )}

            {/* Acción principal */}
            <button
                onClick={handleConfirmOrder}
                disabled={isLoading}
                className="w-full h-14 mt-2 mb-8 flex items-center justify-center rounded-xl bg-gray-900 text-white text-[16px] font-medium shadow-md transition-all active:scale-[0.98] active:bg-gray-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Enviando orden...' : 'Confirmar orden'}
            </button>
        </div>
    );
}