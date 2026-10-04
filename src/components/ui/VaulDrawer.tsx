import { Drawer } from 'vaul';
import AddIcon from '@assets/icons/add-icon.svg?react'

export default function VaulDrawer() {
    return (
        <Drawer.Root>
            <Drawer.Trigger className="w-10 p-2 h-10 flex items-center rounded-full border
            border-gray-200 shadow-sm bg-gray-800 text-white transition-transform active:scale-95 active:bg-gray-700">
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
                        {/* Formulario de registro */}
                        <form className="w-full text-[16px] flex gap-3 flex-col" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50">
                                <input placeholder="Sabor" className="h-12 px-4 border-b border-gray-200 bg-transparent outline-none focus:bg-white transition-colors"/>
                                <div className="relative w-full">
                                    <select
                                        defaultValue=""
                                        className="w-full h-12 appearance-none px-4 bg-transparent outline-none focus:bg-white transition-colors">
                                        <option value="" disabled>Ingrediente base</option>
                                        <option value="Agua">Agua</option>
                                        <option value="Leche">Leche</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <input placeholder="Precio" type="number" className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"/>
                                <input placeholder="Cantidad" type="number" className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white transition-colors focus:border-gray-300"/>
                            </div>

                            <button 
                                type="submit" 
                                className="mt-4 w-full h-12 flex items-center justify-center rounded-xl bg-gray-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guardar producto
                            </button>
                        </form>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}