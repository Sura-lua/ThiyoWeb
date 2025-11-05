import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, []);

  const fetchCombos = useCallback(async () => {
    try {
      const data = await api.getCombos();
      setCombos(data);
    } catch (error) {
      console.error('Failed to fetch combos:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCombos()]);
      setLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchCombos]);

  // Poll for updates every 3 seconds (less frequent than tables/orders)
  useEffect(() => {
    if (loading) return;
    
    const interval = setInterval(() => {
      fetchProducts();
      fetchCombos();
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, fetchProducts, fetchCombos]);

  const addProduct = async (product) => {
    try {
      const result = await api.createProduct(product);
      await fetchProducts();
      return { ...product, id: result.id };
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      await api.updateProduct(id, updates);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const addCombo = async (combo) => {
    try {
      const result = await api.createCombo(combo);
      await fetchCombos();
      return { ...combo, id: result.id };
    } catch (error) {
      console.error('Failed to add combo:', error);
      throw error;
    }
  };

  const updateCombo = async (id, updates) => {
    try {
      await api.updateCombo(id, updates);
      await fetchCombos();
    } catch (error) {
      console.error('Failed to update combo:', error);
      throw error;
    }
  };

  const deleteCombo = async (id) => {
    try {
      await api.deleteCombo(id);
      await fetchCombos();
    } catch (error) {
      console.error('Failed to delete combo:', error);
      throw error;
    }
  };

  const reduceStock = async (productId, quantity) => {
    try {
      await api.reduceStock(productId, quantity);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to reduce stock:', error);
      throw error;
    }
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.minStock);
  };

  const value = {
    products,
    combos,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCombo,
    updateCombo,
    deleteCombo,
    reduceStock,
    getLowStockProducts,
    refreshProducts: fetchProducts,
    refreshCombos: fetchCombos,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
