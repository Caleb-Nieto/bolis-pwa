import { RouterProvider } from "react-router-dom";
import router from "./routes/index.tsx";
import {Provider} from "react-redux";
import {store} from "./store";
import {Toaster} from "react-hot-toast";


const App = () => {
    return ( 
        <Provider store={store}>
            <Toaster toastOptions={
                {
                    style: {
                        borderRadius: '20px',
                        color: 'white',
                        background: '#333'
                    }
                }
            }/>
            <RouterProvider router={router} />
        </Provider>
    );
};

export default App;