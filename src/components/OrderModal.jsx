import { useState } from 'react';
import { useTable } from '../contexts/TableContext';
import { useProduct } from '../contexts/ProductContext';
import ConfirmModal from './ConfirmModal';
import './OrderModal.css';

const OrderModal = ({ tableId, onClose, existingOrderId = null }) => {
  const { createOrder, addItemsToOrder } = useTable();
  const { products, combos, reduceStock } = useProduct();
  const [cart, setCart] = useState([]);
  const [showAlert, setShowAlert] = useState(null);

  const addToCart = (item, type = 'product') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === type);
      if (existing) {
        return prev.map(i => 
          i.id === item.id && i.type === type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, type, quantity: 1 }];
    });
  };

  const removeFromCart = (id, type) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    setCart(prev => prev.map(i => 
      i.id === id && i.type === type
        ? { ...i, quantity }
        : i
    ));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSaveOrder = () => {
    if (cart.length === 0) {
      setShowAlert({
        show: true,
        title: 'คำเตือน',
        message: 'กรุณาเลือกสินค้าหรือคอมโบ',
        onConfirm: () => setShowAlert(null),
        onCancel: () => setShowAlert(null),
        variant: 'default',
        confirmText: 'ตกลง',
        cancelText: '',
      });
      return;
    }

    const orderItems = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type,
    }));

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // ลดสต๊อกสินค้า
    cart.forEach(item => {
      if (item.type === 'product') {
        reduceStock(item.id, item.quantity);
      } else if (item.type === 'combo') {
        // ถ้าเป็น combo ลดสต๊อกของสินค้าใน combo
        item.items?.forEach(comboItem => {
          reduceStock(comboItem.productId, comboItem.quantity * item.quantity);
        });
      }
    });

    if (existingOrderId) {
      // เพิ่มสินค้าเข้าไปในออเดอร์เดิม
      addItemsToOrder(existingOrderId, orderItems, total);
    } else {
      // สร้างออเดอร์ใหม่
      createOrder(tableId, orderItems, total);
    }
    
    setCart([]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>โต๊ะที่ {tableId} - {existingOrderId ? 'เพิ่มออเดอร์' : 'สั่งออเดอร์'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-container">
          <div className="products-section">
            <h3>🔹 เบียร์</h3>
            <div className="products-grid">
              {products.filter(p => p.category === 'beer').map(product => (
                <div key={product.id} className="product-card beer-card">
                  <div className="product-info">
                    <h4>🍺 {product.name}</h4>
                    <p className="price">{product.price} บาท</p>
                    {product.stock <= product.minStock && (
                      <span className="low-stock">สต๊อก: {product.stock}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product, 'product')}
                    disabled={product.stock === 0}
                    className="add-btn"
                  >
                    เพิ่ม
                  </button>
                </div>
              ))}
            </div>

            <h3>🔹 เหล้า</h3>
            <div className="products-grid">
              {products.filter(p => p.category === 'alcohol').map(product => (
                <div key={product.id} className="product-card alcohol-card">
                  <div className="product-info">
                    <h4>🍶 {product.name}</h4>
                    <p className="price">{product.price} บาท</p>
                    {product.stock <= product.minStock && (
                      <span className="low-stock">สต๊อก: {product.stock}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product, 'product')}
                    disabled={product.stock === 0}
                    className="add-btn"
                  >
                    เพิ่ม
                  </button>
                </div>
              ))}
            </div>

            <h3>🔹 ทั่วไป</h3>
            <div className="products-grid">
              {products.filter(p => p.category === 'general').map(product => (
                <div key={product.id} className="product-card drink-card">
                  <div className="product-info">
                    <h4>{product.name === 'น้ำแข็ง' ? '🧊' : '🥤'} {product.name}</h4>
                    <p className="price">{product.price} บาท</p>
                    {product.stock <= product.minStock && (
                      <span className="low-stock">สต๊อก: {product.stock}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product, 'product')}
                    disabled={product.stock === 0}
                    className="add-btn"
                  >
                    เพิ่ม
                  </button>
                </div>
              ))}
            </div>

            <h3>🔹 อาหาร</h3>
            <div className="products-grid">
              {products.filter(p => p.category === 'food').map(product => (
                <div key={product.id} className="product-card food-card">
                  <div className="product-info">
                    <h4>🍗 {product.name}</h4>
                    <p className="price">{product.price} บาท</p>
                    {product.stock <= product.minStock && (
                      <span className="low-stock">สต๊อก: {product.stock}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product, 'product')}
                    disabled={product.stock === 0}
                    className="add-btn"
                  >
                    เพิ่ม
                  </button>
                </div>
              ))}
            </div>

            <h3>🔹 เซ็ทคอมโบ</h3>
            <div className="products-grid">
              {combos.map(combo => (
                <div key={combo.id} className="product-card combo-card">
                  <div className="product-info">
                    <h4>{combo.name}</h4>
                    <p className="price">{combo.price} บาท</p>
                    <p className="combo-items">
                      {combo.items.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? product.name : 'Unknown';
                      }).join(' + ')}
                    </p>
                  </div>
                  <button 
                    onClick={() => addToCart(combo, 'combo')}
                    className="add-btn"
                  >
                    เพิ่ม
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-section">
            <h3>ตะกร้าสินค้า</h3>
            {cart.length === 0 ? (
              <p className="empty-cart">ยังไม่มีสินค้าในตะกร้า</p>
            ) : (
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${item.type}-${idx}`} className="cart-item">
                    <div className="cart-item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price} บาท</span>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}>
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id, item.type)}
                        className="remove-btn"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="cart-total">
              <strong>รวมทั้งหมด: {getTotal()} บาท</strong>
            </div>
            <button className="save-order-btn" onClick={handleSaveOrder}>
              {existingOrderId ? 'เพิ่มสินค้าเข้าออเดอร์' : 'บันทึกออเดอร์'}
            </button>
          </div>
        </div>
      </div>

      {showAlert && (
        <ConfirmModal
          show={showAlert.show}
          title={showAlert.title}
          message={showAlert.message}
          onConfirm={showAlert.onConfirm}
          onCancel={showAlert.onCancel}
          confirmText={showAlert.confirmText}
          cancelText={showAlert.cancelText}
          variant={showAlert.variant}
        />
      )}
    </div>
  );
};

export default OrderModal;

