import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import DynamicCounter from '../components/ui/DynamicCounter';
import { addToCart, removeFromCart } from '../store/cartSlice';

export default function ShoppingCart() {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);

    const totalQuantity = cart.reduce((a, b) => a + b.quantity, 0);
    const total = cart.reduce((a, b) => a + b.quantity * b.price, 0);
    
    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
                <p className="text-gray-500 text-lg font-medium">Los bolis que agregues al carrito se mostraran aqui</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-gray-900 text-2xl font-medium tracking-tight">Resumen de venta</h1>
            
            {/* Lista de productos */}
            <section className="flex flex-col gap-3">
                {cart.map(boli =>
                    <div key={boli.id} className="relative flex border border-gray-200 bg-white rounded-xl p-4 gap-3 w-full items-center shadow-sm">
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-[16px] text-gray-900 font-medium">{boli.flavour}</p>
                            <div className="border border-gray-200 rounded-full bg-gray-50 flex items-center px-2 py-0.5 max-w-max">
                                <p className="text-gray-500 text-[11px] font-medium tracking-wide">{boli.base.toLocaleUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <DynamicCounter 
                                count={boli.quantity}
                                onAddInitial={() => dispatch(addToCart(boli))}
                                onIncrement={() => dispatch(addToCart(boli))}
                                onDecrement={() => dispatch(removeFromCart(boli.id))}
                            />
                            <div className="flex flex-col text-right min-w-max">
                                <p className="text-[14px] text-gray-500">{boli.quantity} x ${boli.price}</p>
                                <p className="text-[16px] font-medium text-gray-900">${boli.quantity * boli.price}</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
            
            {/* Resumen y pago */}
            <div className="relative flex flex-col border border-gray-200 bg-gray-50 rounded-xl p-5 gap-4 w-full shadow-sm">
                <div className="flex w-full justify-between items-center">
                    <p className="text-[15px] text-gray-600">Cantidad total</p>
                    <p className="text-[15px] font-medium text-gray-900">{totalQuantity} {`${totalQuantity>1? "unidades":"unidad"}`}</p>
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
                        <input type="number" min="0" placeholder="0" className="text-[16px] pl-7 pr-3 py-2 text-right w-28 bg-white border border-gray-200 rounded-lg shadow-sm outline-none focus:border-gray-400 transition-colors" />
                    </div>
                </div>
                
                <div className="flex w-full justify-between items-center">
                    <p className="text-[15px] text-gray-600">Devolver</p>
                    <p className="text-[18px] text-gray-900 font-medium">$0</p>
                </div>
            </div>

            {/* Acción principal */}
            <button 
                className="w-full h-14 mt-2 mb-8 flex items-center justify-center rounded-xl bg-gray-900 text-white text-[16px] font-medium shadow-md transition-all active:scale-[0.98] active:bg-gray-800 hover:shadow-lg"
            >
                Confirmar orden
            </button>
        </div>
    );
}