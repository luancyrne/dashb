import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css';
import ServiceMonitoringDashboard from './pages/dashboard';
import { ThemeProvider } from './contexts/theme';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: "/dashboard",
        element: <ServiceMonitoringDashboard />
    }
], {
    future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true
    }
});

createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ThemeProvider>,
)