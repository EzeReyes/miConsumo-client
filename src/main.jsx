// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css';
import { router } from './router';

// 1. Crear el cliente de Apollo
const client = new ApolloClient({
  uri: 'https://miconsumo-server.onrender.com/graphql', // http://localhost:5050/graphql Cambiá esto si tu servidor está en otro puerto
  cache: new InMemoryCache(),
  credentials: "include", // IMPORTANTE para que se acepten cookies
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolver RouterProvider dentro de ApolloProvider */}
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);
