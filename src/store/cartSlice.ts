import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: number;
    flavour: string;
    base: string;
    stock: number;
    price: number;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    products: Product[];
    cart: CartItem[];
}

const initialState: CartState = {
    products: [],
    cart: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            // Merge new product data while preserving cart-adjusted stock
            const cartDeductions: Record<number, number> = {};
            state.cart.forEach(item => {
                cartDeductions[item.id] = item.quantity;
            });

            state.products = action.payload.map(p => ({
                ...p,
                stock: Number(p.stock) - (cartDeductions[p.id] ?? 0),
                price: Number(p.price),
            }));
        },
        addToCart: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const existingItem = state.cart.find(item => item.id === product.id);
            const storeProduct = state.products.find(p => p.id === product.id);
            
            if (storeProduct && storeProduct.stock > 0) {
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.cart.push({ ...product, quantity: 1, stock: Number(product.stock), price: Number(product.price) });
                }
                storeProduct.stock -= 1;
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            const existingItemIndex = state.cart.findIndex(item => item.id === id);
            if (existingItemIndex !== -1) {
                const item = state.cart[existingItemIndex];
                const storeProduct = state.products.find(p => p.id === id);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.cart.splice(existingItemIndex, 1);
                }
                
                if (storeProduct) {
                    storeProduct.stock += 1;
                }
            }
        },
        updateQuantity: (state, action: PayloadAction<{id: number, quantity: number}>) => {
            const { id, quantity } = action.payload;
            const existingItemIndex = state.cart.findIndex(item => item.id === id);
            const storeProduct = state.products.find(p => p.id === id);
            
            if (existingItemIndex !== -1 && storeProduct) {
                const item = state.cart[existingItemIndex];
                const diff = quantity - item.quantity;
                
                if (storeProduct.stock - diff >= 0) {
                    item.quantity = quantity;
                    storeProduct.stock -= diff;
                    if (item.quantity <= 0) {
                        state.cart.splice(existingItemIndex, 1);
                    }
                }
            }
        },
        clearCart: (state) => {
            // Return cart items' quantities back to products stock before clearing
            state.cart.forEach(item => {
                const storeProduct = state.products.find(p => p.id === item.id);
                if (storeProduct) {
                    storeProduct.stock += item.quantity;
                }
            });
            state.cart = [];
        },
    }
});

export const { setProducts, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
