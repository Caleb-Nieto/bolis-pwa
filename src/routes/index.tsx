import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "@components/layout/MainLayout.tsx";
import { ProtectedRoute } from "@components/guards/ProtectedRoute.tsx";

// Lazy load pages for code splitting
const Main = lazy(() => import("../pages/Main.tsx"));
const ShoppingCart = lazy(() => import("../pages/ShoppingCart.tsx"));
const Login = lazy(() => import("../pages/Login.tsx"));

// Optional: A simple fallback component for Suspense
const PageLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
);

const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<PageLoader />}>
                <Login />
            </Suspense>
        )
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
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <Main />
                            </Suspense>
                        )
                    },
                    {
                        path: '/basket',
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <ShoppingCart />
                            </Suspense>
                        )
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