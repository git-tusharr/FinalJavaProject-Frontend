import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProductProvider } from "./services/ProductContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./services/CartContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
    <ProductProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProductProvider>
    </CartProvider>
  </React.StrictMode>
);
