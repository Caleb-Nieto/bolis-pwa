import { RouterProvider } from "react-router-dom";
import router from "./routes/index.tsx";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster, toast } from "react-hot-toast";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect } from "react";

const PWAPrompt = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisterError(error) {
            console.error('SW registration error', error);
        },
    });

    useEffect(() => {
        if (offlineReady) {
            toast.success('App lista para uso sin conexión', { position: 'bottom-center' });
            setOfflineReady(false);
        } else if (needRefresh) {
            toast(
                (t) => (
                    <div className="flex flex-col gap-2 text-sm">
                        <span>Hay una actualización disponible. ¿Deseas recargar?</span>
                        <div className="flex gap-2 mt-2">
                            <button
                                className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors active:bg-gray-200"
                                onClick={() => {
                                    toast.loading('Actualizando...', { id: t.id });
                                    updateServiceWorker(true);
                                }}
                            >
                                Actualizar
                            </button>
                            <button
                                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg font-medium transition-colors active:bg-gray-500"
                                onClick={() => {
                                    setNeedRefresh(false);
                                    toast.dismiss(t.id);
                                }}
                            >
                                Ignorar
                            </button>
                        </div>
                    </div>
                ),
                { duration: Infinity, position: 'bottom-center' }
            );
        }
    }, [offlineReady, needRefresh, updateServiceWorker, setNeedRefresh, setOfflineReady]);

    return null;
};

const App = () => {
    return ( 
        <Provider store={store}>
            <PWAPrompt />
            <Toaster toastOptions={{
                style: {
                    borderRadius: '20px',
                    color: 'white',
                    background: '#333'
                }
            }}/>
            <RouterProvider router={router} />
        </Provider>
    );
};

export default App;