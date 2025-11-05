import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { useTable } from '../contexts/TableContext';
import { useProduct } from '../contexts/ProductContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getTodayRevenue,
  getMonthlyRevenue,
  getYearlyRevenue,
  getBestSellingProducts,
  getAllMonthsData,
  getDailyRevenueForMonth,
  getAllYearsData,
} from '../utils/reports';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { orders, completeOrder } = useTable();
  const { products, getLowStockProducts } = useProduct();
  const [activeTab, setActiveTab] = useState('revenue-today');
  const [expandedMonth, setExpandedMonth] = useState(null);

  const todayRevenue = getTodayRevenue(orders);
  const currentYear = new Date().getFullYear();
  const yearlyRevenue = getYearlyRevenue(orders, currentYear);
  const monthlyData = getAllMonthsData(orders);
  const yearlyData = getAllYearsData(orders);
  const bestSelling = getBestSellingProducts(orders, products);
  const lowStockProducts = getLowStockProducts();

  const handleLogout = () => {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleMonthExpansion = (monthIndex) => {
    setExpandedMonth(expandedMonth === monthIndex ? null : monthIndex);
  };

  const activeOrders = orders.filter(o => o.status === 'active');

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">ออกจากระบบ</button>
      </div>

      <div className="admin-nav">
        <button 
          className={activeTab === 'revenue-today' ? 'active' : ''}
          onClick={() => setActiveTab('revenue-today')}
        >
          รายได้วันนี้
        </button>
        <button 
          className={activeTab === 'revenue-monthly' ? 'active' : ''}
          onClick={() => setActiveTab('revenue-monthly')}
        >
          รายได้รายเดือน
        </button>
        <button 
          className={activeTab === 'revenue-yearly' ? 'active' : ''}
          onClick={() => setActiveTab('revenue-yearly')}
        >
          รายได้รายปี
        </button>
        <button 
          className={activeTab === 'best-selling' ? 'active' : ''}
          onClick={() => setActiveTab('best-selling')}
        >
          สินค้าขายดี
        </button>
        <button 
          className={activeTab === 'stock' ? 'active' : ''}
          onClick={() => setActiveTab('stock')}
        >
          สต๊อกสินค้า
        </button>
        <button 
          className={activeTab === 'combos' ? 'active' : ''}
          onClick={() => setActiveTab('combos')}
        >
          จัดการคอมโบ
        </button>
        <button 
          className={activeTab === 'active-orders' ? 'active' : ''}
          onClick={() => setActiveTab('active-orders')}
        >
          ออเดอร์ที่กำลังใช้งาน
        </button>
        <button 
          className={activeTab === 'print' ? 'active' : ''}
          onClick={() => setActiveTab('print')}
        >
          ปริ้นใบเช็ค
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'revenue-today' && (
          <div className="report-section">
            <h2>รายได้วันนี้</h2>
            <div className="revenue-card">
              <div className="revenue-amount">{todayRevenue.toLocaleString()} บาท</div>
              <p>วันที่ {new Date().toLocaleDateString('th-TH')}</p>
            </div>
          </div>
        )}

        {activeTab === 'revenue-monthly' && (
          <div className="report-section">
            <h2>รายได้รายเดือน ปี {currentYear}</h2>
            
            {/* กราฟรายได้รายเดือน */}
            <div className="chart-container">
              <h3>กราฟรายได้รายเดือน</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="monthName" 
                    tick={{ fill: '#333', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: '#333', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} บาท`, 'รายได้']}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #2d8659',
                      borderRadius: '8px',
                      padding: '10px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#2d8659" 
                    name="รายได้ (บาท)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* กราฟเส้นรายได้รายเดือน */}
            <div className="chart-container">
              <h3>แนวโน้มรายได้รายเดือน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="monthName" 
                    tick={{ fill: '#333', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: '#333', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} บาท`, 'รายได้']}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #2d8659',
                      borderRadius: '8px',
                      padding: '10px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2d8659" 
                    strokeWidth={3}
                    name="รายได้ (บาท)"
                    dot={{ fill: '#2d8659', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ตารางรายได้รายเดือน */}
            <div className="table-container">
              <h3>ตารางรายได้รายเดือน</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>เดือน</th>
                    <th>รายได้ (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map(month => {
                    const dailyData = getDailyRevenueForMonth(orders, month.year, month.monthIndex);
                    const isExpanded = expandedMonth === month.monthIndex;
                    
                    return (
                      <React.Fragment key={month.month}>
                        <tr className={month.revenue > 0 ? 'has-revenue' : ''}>
                          <td>
                            {month.revenue > 0 && (
                              <button
                                className="expand-btn"
                                onClick={() => toggleMonthExpansion(month.monthIndex)}
                              >
                                {isExpanded ? '▼' : '▶'}
                              </button>
                            )}
                          </td>
                          <td>
                            <strong>{month.monthName}</strong>
                          </td>
                          <td className="revenue-cell">
                            <strong>{month.revenue.toLocaleString()}</strong>
                          </td>
                        </tr>
                        {isExpanded && dailyData.length > 0 && (
                          <tr className="daily-details-row">
                            <td colSpan="3">
                              <div className="daily-revenue-details">
                                <h4>รายได้รายวัน - {month.monthName}</h4>
                                <table className="daily-table">
                                  <thead>
                                    <tr>
                                      <th>วันที่</th>
                                      <th>จำนวนออเดอร์</th>
                                      <th>รายได้ (บาท)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dailyData.map((day, idx) => (
                                      <tr key={idx}>
                                        <td>{day.dateString}</td>
                                        <td>{day.orderCount} ออเดอร์</td>
                                        <td className="revenue-cell">{day.revenue.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'revenue-yearly' && (
          <div className="report-section">
            <h2>รายได้รายปี</h2>
            
            {/* กราฟรายได้รายปี */}
            {yearlyData.length > 0 ? (
              <>
                <div className="chart-container">
                  <h3>กราฟรายได้รายปี</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="yearName" 
                        tick={{ fill: '#333', fontSize: 14 }}
                      />
                      <YAxis 
                        tick={{ fill: '#333', fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString()} บาท`, 'รายได้']}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #2d8659',
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        fill="#2d8659" 
                        name="รายได้ (บาท)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* กราฟเส้นรายได้รายปี */}
                <div className="chart-container">
                  <h3>แนวโน้มรายได้รายปี</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="yearName" 
                        tick={{ fill: '#333', fontSize: 14 }}
                      />
                      <YAxis 
                        tick={{ fill: '#333', fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString()} บาท`, 'รายได้']}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #2d8659',
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#2d8659" 
                        strokeWidth={3}
                        name="รายได้ (บาท)"
                        dot={{ fill: '#2d8659', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* ตารางรายได้รายปี */}
                <div className="table-container">
                  <h3>ตารางรายได้รายปี</h3>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>ปี</th>
                        <th>รายได้ (บาท)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyData.map((yearData) => (
                        <tr key={yearData.year}>
                          <td><strong>{yearData.yearName}</strong></td>
                          <td className="revenue-cell">
                            <strong>{yearData.revenue.toLocaleString()}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="revenue-card">
                <div className="revenue-amount">{yearlyRevenue.toLocaleString()} บาท</div>
                <p>ปี {currentYear}</p>
                <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
                  ยังไม่มีข้อมูลปีอื่นๆ
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'best-selling' && (
          <div className="report-section">
            <h2>สินค้าขายดี</h2>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>อันดับ</th>
                    <th>ชื่อสินค้า</th>
                    <th>จำนวนที่ขาย</th>
                    <th>รายได้รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSelling.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>ยังไม่มีข้อมูลการขาย</td>
                    </tr>
                  ) : (
                    bestSelling.map((item, idx) => (
                      <tr key={item.productId}>
                        <td>{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td className="revenue-cell">{item.revenue.toLocaleString()} บาท</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <StockManagement />
        )}

        {activeTab === 'combos' && (
          <ComboManagement />
        )}

        {activeTab === 'active-orders' && (
          <ActiveOrdersManagement />
        )}

        {activeTab === 'print' && (
          <PrintCheck />
        )}
      </div>
    </div>
  );
};

const StockManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'beer',
    stock: '',
    minStock: '',
  });

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: 'beer', stock: '', minStock: '' });
    setShowAddModal(true);
  };

  const handleResetProducts = () => {
    if (confirm('ต้องการรีเซ็ตข้อมูลสินค้าเป็นค่าเริ่มต้นหรือไม่?\n(จะลบข้อมูลสินค้าทั้งหมดและเพิ่มสินค้าใหม่)')) {
      localStorage.removeItem('products');
      localStorage.removeItem('combos');
      window.location.reload();
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setShowAddModal(false);
    setFormData({ name: '', price: '', category: 'beer', stock: '', minStock: '' });
  };

  const handleDelete = (id) => {
    if (confirm('ต้องการลบสินค้านี้หรือไม่?')) {
      deleteProduct(id);
    }
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const getCategoryName = (category) => {
    const categories = {
      beer: 'เบียร์',
      alcohol: 'เหล้า',
      general: 'ทั่วไป',
      food: 'อาหาร',
    };
    return categories[category] || category;
  };

  const getCategoryProducts = (category) => {
    return products.filter(p => p.category === category);
  };

  return (
    <div className="stock-management">
      <div className="section-header">
        <h2>จัดการสต๊อกสินค้า</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleResetProducts} className="btn-reset">รีเซ็ตข้อมูลสินค้า</button>
          <button onClick={handleAdd} className="btn-add">+ เพิ่มสินค้า</button>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="alert-warning">
          <strong>⚠️ สินค้าใกล้หมดสต๊อก:</strong>
          <ul>
            {lowStockProducts.map(p => (
              <li key={p.id}>{p.name} - เหลือ {p.stock} ชิ้น</li>
            ))}
          </ul>
        </div>
      )}

      {['beer', 'alcohol', 'general', 'food'].map(category => {
        const categoryProducts = getCategoryProducts(category);
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category} className="category-section">
            <h3 className="category-title">{getCategoryName(category)}</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>ชื่อสินค้า</th>
                    <th>ราคา</th>
                    <th>สต๊อก</th>
                    <th>ขั้นต่ำ</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryProducts.map(product => (
                    <tr key={product.id} className={product.stock <= product.minStock ? 'low-stock-row' : ''}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.price} บาท</td>
                      <td>{product.stock}</td>
                      <td>{product.minStock}</td>
                      <td>
                        {product.stock <= product.minStock ? (
                          <span className="status-badge warning">ใกล้หมด</span>
                        ) : (
                          <span className="status-badge success">ปกติ</span>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEdit(product)} className="btn-edit">แก้ไข</button>
                        <button onClick={() => handleDelete(product.id)} className="btn-delete">ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}</h3>
            <div className="form-group">
              <label>ชื่อสินค้า:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>หมวดหมู่:</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="beer">เบียร์</option>
                <option value="alcohol">เหล้า</option>
                <option value="general">ทั่วไป</option>
                <option value="food">อาหาร</option>
              </select>
            </div>
            <div className="form-group">
              <label>ราคา:</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>สต๊อก:</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>สต๊อกขั้นต่ำ:</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSave} className="btn-save">บันทึก</button>
              <button onClick={() => setShowAddModal(false)} className="btn-cancel">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ComboManagement = () => {
  const { combos, products, addCombo, updateCombo, deleteCombo } = useProduct();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    items: [],
  });

  const handleAdd = () => {
    setEditingCombo(null);
    setFormData({ name: '', price: '', items: [] });
    setShowAddModal(true);
  };

  const handleEdit = (combo) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      price: combo.price,
      items: combo.items || [],
    });
    setShowAddModal(true);
  };

  const addItemToCombo = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }],
    });
  };

  const updateComboItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeComboItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || formData.items.length === 0) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const comboData = {
      name: formData.name,
      price: parseFloat(formData.price),
      items: formData.items,
    };

    if (editingCombo) {
      updateCombo(editingCombo.id, comboData);
    } else {
      addCombo(comboData);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('ต้องการลบคอมโบนี้หรือไม่?')) {
      deleteCombo(id);
    }
  };

  return (
    <div className="combo-management">
      <div className="section-header">
        <h2>จัดการเซ็ทคอมโบ</h2>
        <button onClick={handleAdd} className="btn-add">+ เพิ่มคอมโบ</button>
      </div>

      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อคอมโบ</th>
              <th>รายการสินค้า</th>
              <th>ราคา</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {combos.map(combo => (
              <tr key={combo.id}>
                <td>{combo.id}</td>
                <td>{combo.name}</td>
                <td>
                  {combo.items?.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return product ? `${product.name} x${item.quantity}` : 'Unknown';
                  }).join(', ')}
                </td>
                <td>{combo.price} บาท</td>
                <td>
                  <button onClick={() => handleEdit(combo)} className="btn-edit">แก้ไข</button>
                  <button onClick={() => handleDelete(combo.id)} className="btn-delete">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCombo ? 'แก้ไขคอมโบ' : 'เพิ่มคอมโบ'}</h3>
            <div className="form-group">
              <label>ชื่อคอมโบ:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>ราคา:</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>รายการสินค้า:</label>
              {formData.items.map((item, index) => (
                <div key={index} className="combo-item-row">
                  <select
                    value={item.productId}
                    onChange={(e) => updateComboItem(index, 'productId', parseInt(e.target.value))}
                  >
                    <option value="">เลือกสินค้า</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateComboItem(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    style={{ width: '80px' }}
                  />
                  <button onClick={() => removeComboItem(index)} className="btn-remove">ลบ</button>
                </div>
              ))}
              <button onClick={addItemToCombo} className="btn-add-item">+ เพิ่มสินค้า</button>
            </div>
            <div className="modal-actions">
              <button onClick={handleSave} className="btn-save">บันทึก</button>
              <button onClick={() => setShowAddModal(false)} className="btn-cancel">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActiveOrdersManagement = () => {
  const { orders, completeOrder, cancelOrder } = useTable();

  const activeOrders = orders.filter(o => o.status === 'active');

  const handleComplete = (orderId) => {
    if (confirm('ต้องการปิดออเดอร์นี้หรือไม่?')) {
      completeOrder(orderId);
    }
  };

  const handleCancel = (orderId) => {
    if (confirm('ต้องการยกเลิกออเดอร์นี้หรือไม่?')) {
      cancelOrder(orderId);
    }
  };

  return (
    <div className="active-orders-management">
      <h2>ออเดอร์ที่กำลังใช้งาน</h2>
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>ออเดอร์ #</th>
              <th>โต๊ะ</th>
              <th>รายการ</th>
              <th>จำนวนเงิน</th>
              <th>เวลา</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {activeOrders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>ยังไม่มีออเดอร์ที่กำลังใช้งาน</td>
              </tr>
            ) : (
              activeOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>โต๊ะ {order.tableId}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.name} x{item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="revenue-cell">{order.total} บาท</td>
                  <td>{new Date(order.createdAt).toLocaleString('th-TH')}</td>
                  <td>
                    <button onClick={() => handleComplete(order.id)} className="btn-complete-order">
                      ปิดออเดอร์
                    </button>
                    <button onClick={() => handleCancel(order.id)} className="btn-cancel-order">
                      ยกเลิก
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PrintCheck = () => {
  const { orders } = useTable();
  const completedOrders = orders.filter(o => o.status === 'completed');

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>ใบเช็ค - ออเดอร์ #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ร้านโปรด นั่งชิว บาร์เบียร์</h2>
            <p>ใบเช็ค</p>
          </div>
          <div class="order-info">
            <p>ออเดอร์ #${order.id}</p>
            <p>โต๊ะที่: ${order.tableId}</p>
            <p>วันที่: ${new Date(order.completedAt).toLocaleString('th-TH')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>รายการ</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price} บาท</td>
                  <td>${item.price * item.quantity} บาท</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>รวมทั้งหมด: ${order.total} บาท</p>
          </div>
          <p style="text-align: center; margin-top: 40px;">ขอบคุณที่ใช้บริการ</p>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="print-check">
      <h2>ปริ้นใบเช็ค</h2>
      <p>เลือกออเดอร์ที่ต้องการปริ้นใบเช็ค</p>
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>ออเดอร์ #</th>
              <th>โต๊ะ</th>
              <th>วันที่</th>
              <th>จำนวนเงิน</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>ยังไม่มีออเดอร์ที่เสร็จสิ้น</td>
              </tr>
            ) : (
              completedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>โต๊ะ {order.tableId}</td>
                  <td>{new Date(order.completedAt).toLocaleString('th-TH')}</td>
                  <td>{order.total} บาท</td>
                  <td>
                    <button onClick={() => handlePrint(order)} className="btn-print">ปริ้น</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

