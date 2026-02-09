import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productState, setProductState] = useState({
    productId: null,
    categoryId: null,
    brandId: null,
    attributes: [],
    variants: []
  });

  return (
    <ProductContext.Provider value={{ productState, setProductState }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
