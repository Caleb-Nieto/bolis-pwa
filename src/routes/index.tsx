import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout.tsx";
import { ProtectedRoute } from "@components/guards/ProtectedRoute.tsx";

import Main from "../pages/Main.tsx";
import NewRegister from "../pages/NewRegister.tsx";
import Basket from "../pages/Basket.tsx";
import Login from "../pages/Login.tsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        element: <ProtectedRoute />,
        //errorElement: <ErrorPage />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/main',
                        element: <Main />
                    },
                    {
                        path: '/basket',
                        element: <Basket />
                    },
                    {
                        path: '/new-register',
                        element: <NewRegister />
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/main" replace />
    }
]);

export default router;