import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const TableContext = createContext();

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within TableProvider');
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchTables = useCallback(async () => {
    try {
      const data = await api.getTables();
      setTables(data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTables(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, [fetchTables, fetchOrders]);

  // Poll for updates every 2 seconds
  useEffect(() => {
    if (loading) return;
    
    const interval = setInterval(() => {
      fetchTables();
      fetchOrders();
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, fetchTables, fetchOrders]);

  const selectTable = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.status === 'available') {
      setSelectedTable(tableId);
      return true;
    }
    return false;
  };

  const reserveTable = async (tableId, reservedBy) => {
    try {
      await api.updateTable(tableId, {
        status: 'reserved',
        reservedBy,
        orderId: null,
      });
      await fetchTables();
    } catch (error) {
      console.error('Failed to reserve table:', error);
      throw error;
    }
  };

  const releaseReservation = async (tableId) => {
    try {
      await api.updateTable(tableId, {
        status: 'available',
        reservedBy: null,
        orderId: null,
      });
      await fetchTables();
    } catch (error) {
      console.error('Failed to release reservation:', error);
      throw error;
    }
  };

  const createOrder = async (tableId, orderItems, total) => {
    try {
      const result = await api.createOrder({
        tableId,
        items: orderItems,
        total,
      });
      await Promise.all([fetchTables(), fetchOrders()]);
      setSelectedTable(null);
      return result;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await api.completeOrder(orderId);
      await Promise.all([fetchTables(), fetchOrders()]);
    } catch (error) {
      console.error('Failed to complete order:', error);
      throw error;
    }
  };

  const addItemsToOrder = async (orderId, newItems, additionalTotal) => {
    try {
      await api.addItemsToOrder(orderId, {
        newItems,
        additionalTotal,
      });
      await fetchOrders();
    } catch (error) {
      console.error('Failed to add items to order:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        await api.updateTable(order.tableId, {
          status: 'available',
          orderId: null,
          reservedBy: null,
        });
        await fetchTables();
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  };

  const value = {
    tables,
    orders,
    selectedTable,
    loading,
    selectTable,
    reserveTable,
    releaseReservation,
    createOrder,
    addItemsToOrder,
    completeOrder,
    cancelOrder,
    setSelectedTable,
    refreshTables: fetchTables,
    refreshOrders: fetchOrders,
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};
