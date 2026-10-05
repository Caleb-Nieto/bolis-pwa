import { useState } from 'react';
import { Drawer } from 'vaul';
import AddIcon from '@assets/icons/add-icon.svg?react';
import { useGetBoliCategoriesQuery, useCreateBoliMutation } from '../../store/bolisApi';

export default function VaulDrawer() {
    const [open, setOpen] = useState(false);

    // Form state
    const [flavour, setFlavour] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [stockQuantity, setStockQuantity] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMsg, setSuccessMsg] = useState('');

    const { data: categories = [] } = useGetBoliCategoriesQuery();
    const [createBoli, { isLoading }] = useCreateBoliMutation();
    

    const resetForm = () => {
        setFlavour('');
        setSelectedCategoryId(0);
        setPrice(0);
        setStockQuantity('');
        setErrors({});
        setSuccessMsg('');
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!flavour.trim()) newErrors.flavour = 'El sabor es requerido';
        if (selectedCategoryId === 0) newErrors.category = 'El ingrediente base es requerido';
        if (!stockQuantity || Number(stockQuantity) < 0) newErrors.stock = 'La cantidad es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        if (!validate()) return;

        try {
            await createBoli({
                flavour: flavour.trim(),
                categoryId: Number(selectedCategoryId),
                stockQuantity: Number(stockQuantity),
            }).unwrap();

            setSuccessMsg('¡Boli creado exitosamente!');
            resetForm();
            setTimeout(() => {
                //setOpen(false);
                setSuccessMsg('');
            }, 1200);
        } catch {
            setErrors({ submit: 'Error al crear el boli. Intenta de nuevo.' });
        }
    };

    return (
        <Drawer.Root open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <Drawer.Trigger className="w-11 p-2 h-11 flex items-center rounded-full border border-gray-200 shadow-sm bg-gray-800 text-white transition-transform active:scale-95 active:bg-gray-700">
                <AddIcon height="24" className="mx-auto" />
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <Drawer.Content className="bg-white rounded-t-2xl h-fit fixed bottom-0 left-0 right-0 outline-none shadow-2xl">
                    <Drawer.Handle className="mt-3 mb-2" />
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col text-center">
                            <h1 className="text-xl font-medium text-gray-900">Nuevo sabor</h1>
                            <p className="text-sm text-gray-500">Agrega un nuevo producto a la lista</p>
                        </div>

                        {successMsg && (
                            <div className="text-center text-sm text-green-600 font-medium py-1">
                                {successMsg}
                            </div>
                        )}

                        {errors.submit && (
                            <div className="text-center text-sm text-red-500 font-medium py-1">
                                {errors.submit}
                            </div>
                        )}

                        <form className="w-full text-[16px] flex gap-3 flex-col" onSubmit={handleSubmit}>
                            {/* Sabor */}
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50">
                                    <input
                                        value={flavour}
                                        onChange={e => setFlavour(e.target.value)}
                                        placeholder="Sabor"
                                        className="h-12 px-4 border-b border-gray-200 bg-transparent outline-none focus:bg-white transition-colors"
                                    />

                                    {/* Ingrediente base / Category */}
                                    <div className="relative w-full">
                                        <select
                                            defaultValue={'0'}
                                            onChange={e => {
                                                setSelectedCategoryId(+e.target.value);
                                                const selectedCategory = categories.find(c => c.boliCategoryId === +e.target.value);
                                                setPrice(selectedCategory?.price?? 0);
                                            }}
                                            className="w-full h-12 appearance-none px-4 bg-transparent outline-none focus:bg-white transition-colors"
                                        >
                                            <option value="0" disabled>Ingrediente base</option>
                                            {categories.map(cat => (
                                                <option key={cat.boliCategoryId} value={cat.boliCategoryId}>
                                                    {cat.category.toLocaleUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {errors.flavour && <p className="text-xs text-red-500 px-1">{errors.flavour}</p>}
                                {errors.category && <p className="text-xs text-red-500 px-1">{errors.category}</p>}
                            </div>

                            {/* Precio y cantidad */}
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            disabled
                                            value={price}
                                            placeholder="Precio"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full h-12 text-right px-4 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"
                                        />
                                    </div>
                                    {errors.price && <p className="text-xs text-red-500 px-1">{errors.price}</p>}
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <input
                                        value={stockQuantity}
                                        onChange={e => setStockQuantity(e.target.value)}
                                        placeholder="Cantidad"
                                        type="number"
                                        min="0"
                                        className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"
                                    />
                                    {errors.stock && <p className="text-xs text-red-500 px-1">{errors.stock}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 w-full h-12 flex items-center justify-center rounded-xl bg-gray-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar producto'}
                            </button>
                        </form>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}