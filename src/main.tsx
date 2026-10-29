import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./all.min.css";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import Register from "./pages/Auth/Register.tsx";
import AuthLayout from "./layout/auth/AuthLayout.tsx";
import { Toast } from "@heroui/react";
import Login from "./pages/Auth/Login.tsx";
import AuthContext from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Feed from "./pages/Home/Feed.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeLayout from "./layout/home/HomeLayout.tsx";
import MyPosts from "./pages/Home/MyPosts.tsx";
import Community from "./pages/Home/Community.tsx";
import Bookmarks from "./pages/Home/Bookmarks.tsx";
import Post from "./pages/Home/Post.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Profile from "./pages/Profile/Profile.tsx";

const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/home" replace /> },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        element: <AuthLayout />,
        children: [
            { path: "register", element: <Register /> },
            { path: "login", element: <Login /> },
        ],
    },
    {
        element: <HomeLayout />,
        children: [
            {
                path: "home",
                element: (
                    <ProtectedRoute>
                        <Feed />
                    </ProtectedRoute>
                ),
            },
            {
                path: "community",
                element: (
                    <ProtectedRoute>
                        <Community />
                    </ProtectedRoute>
                ),
            },
            {
                path: "saved",
                element: (
                    <ProtectedRoute>
                        <Bookmarks />
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-posts",
                element: (
                    <ProtectedRoute>
                        <MyPosts />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/posts/:id",
        element: (
            <ProtectedRoute>
                <Post />
            </ProtectedRoute>
        ),
    },
    { path: "/settings", element: <Settings /> },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthContext>
                <Toast.Provider placement="top" />
                <RouterProvider router={router} />
            </AuthContext>
        </QueryClientProvider>
    </StrictMode>,
);
