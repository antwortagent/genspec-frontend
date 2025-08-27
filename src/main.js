import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import '@/styles/global.css';
const el = document.getElementById('root');
createRoot(el).render(_jsx(React.StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
