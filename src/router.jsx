// src/router.js
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./pages/Login.jsx";
import NewExpense from "./pages/NewExpense.jsx";
import EditExpense from "./pages/EditExpense.jsx";
import Confirmar from "./pages/Confirmar.jsx"
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NewPassword from "./pages/NewPassword.jsx"
import PersonalData from "./pages/PersonalData.jsx";
import ExpensesDetail from "./pages/ExpensesDetail.jsx";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";
import NewTask from "./pages/NewTask.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: 'reset-password/:token',
                element: <NewPassword />
            },
            {
                path: '/confirmar/:token',
                element: <Confirmar />
            },
            {
                index: true,
                element: <Home />,
                // loader: productsLoader,
                // action: updateAvailabilityAction
            },
            {
                path: 'expense/detail',
                element: <ExpensesDetail />
            },
            {
                path: 'expense/new',
                element: <NewExpense />,
            },
            {
                path: 'expense/:id/edit', //ROA Pattern - Resource-oriented design
                element: <EditExpense />,
                // loader: editProductLoader,
                // action: editProductAction
            },
            {
                path: '/personaldata',
                element: <PersonalData />
            },
            {
                path: 'task/new',
                element: <NewTask />
            },
            {
                path: '*',
                element: <Error/>
            }
            // {
            //     path: 'productos/:id/eliminar', //ROA Pattern - Resource-oriented design
            //     action: deleteProductAction
            // }
        ]
    }
]);