import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from '../contexts/TableContext';
import OrderModal from './OrderModal';
import ConfirmModal from './ConfirmModal';
import './TableSelector.css';

const TableSelector = () => {
  const navigate = useNavigate();
  const { tables, selectTable, reserveTable, releaseReservation, orders, completeOrder } = useTable();
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTableForAddOrder, setSelectedTableForAddOrder] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveTableId, setReserveTableId] = useState(null);
  const [reservedBy, setReservedBy] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  const handleTableClick = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    
    if (table.status === 'reserved') {
      setConfirmModal({
        show: true,
        title: 'โต๊ะถูกจอง',
        message: `โต๊ะนี้ถูกจองโดย: ${table.reservedBy}`,
        onConfirm: () => setConfirmModal(null),
        onCancel: () => setConfirmModal(null),
        variant: 'default',
        confirmText: 'ตกลง',
        cancelText: '',
      });
      return;
    }

    if (table.status === 'occupied') {
      const order = orders.find(o => o.id === table.orderId);
      if (order) {
        setConfirmModal({
          show: true,
          title: 'โต๊ะมีออเดอร์อยู่แล้ว',
          message: `โต๊ะนี้มีออเดอร์อยู่แล้ว\nออเดอร์ #${order.id}\n\nรวม: ${order.total} บาท`,
          onConfirm: () => setConfirmModal(null),
          onCancel: () => setConfirmModal(null),
          variant: 'default',
          confirmText: 'ตกลง',
          cancelText: '',
        });
      }
      return;
    }

    if (selectTable(tableId)) {
      setSelectedTable(tableId);
    }
  };

  const handleReserveClick = (tableId) => {
    setReserveTableId(tableId);
    setShowReserveModal(true);
  };

  const confirmReserve = () => {
    if (!reservedBy.trim()) {
      setConfirmModal({
        show: true,
        title: 'คำเตือน',
        message: 'กรุณาระบุชื่อผู้จอง',
        onConfirm: () => setConfirmModal(null),
        onCancel: () => setConfirmModal(null),
        variant: 'default',
        confirmText: 'ตกลง',
        cancelText: '',
      });
      return;
    }
    reserveTable(reserveTableId, reservedBy);
    setShowReserveModal(false);
    setReservedBy('');
    setReserveTableId(null);
  };

  const handleCompleteOrder = (tableId, order) => {
    setConfirmModal({
      show: true,
      title: 'ยืนยันปิดออเดอร์',
      message: `ต้องการปิดออเดอร์โต๊ะที่ ${tableId} หรือไม่?\n\nรวมทั้งหมด: ${order.total} บาท`,
      onConfirm: () => {
        completeOrder(order.id);
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
      variant: 'success',
      confirmText: 'ปิดออเดอร์',
    });
  };

  const handleReleaseReservation = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    setConfirmModal({
      show: true,
      title: 'ยืนยันยกเลิกการจอง',
      message: `ต้องการยกเลิกการจองโต๊ะที่ ${tableId} หรือไม่?\n\nจองโดย: ${table?.reservedBy}`,
      onConfirm: () => {
        releaseReservation(tableId);
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
      variant: 'danger',
      confirmText: 'ยกเลิกการจอง',
    });
  };

  const getTableStatusClass = (status) => {
    switch (status) {
      case 'occupied':
        return 'occupied';
      case 'reserved':
        return 'reserved';
      default:
        return 'available';
    }
  };

  const getTableStatusText = (status) => {
    switch (status) {
      case 'occupied':
        return 'ใช้งานอยู่';
      case 'reserved':
        return 'ถูกจอง';
      default:
        return 'ว่าง';
    }
  };

  return (
    <div className="table-selector-container">
      <div className="header">
        <h1>ร้านโปรด นั่งชิว บาร์เบียร์</h1>
        <p>เลือกโต๊ะเพื่อเริ่มออเดอร์</p>
        <button className="admin-link-btn" onClick={() => navigate('/login')}>
          เข้าสู่ระบบ Admin
        </button>
      </div>

      <div className="tables-grid">
        {tables.map(table => {
          const order = table.status === 'occupied' ? orders.find(o => o.id === table.orderId) : null;
          
          return (
            <div key={table.id} className={`table-card ${getTableStatusClass(table.status)}`}>
              <div className="table-number">โต๊ะ {table.number}</div>
              <div className="table-status">{getTableStatusText(table.status)}</div>
              
              {table.status === 'reserved' && (
                <div className="reserved-info">
                  <small>จองโดย: {table.reservedBy}</small>
                </div>
              )}

              {table.status === 'occupied' && order && (
                <div className="order-info">
                  <div className="order-header">
                    <strong>ออเดอร์ #{order.id}</strong>
                    <span className="order-total">{order.total} บาท</span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">{item.price * item.quantity} บาท</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="table-actions">
              {table.status === 'available' && (
                <>
                  <button 
                    className="btn-select"
                    onClick={() => handleTableClick(table.id)}
                  >
                    เลือกโต๊ะ
                  </button>
                  <button 
                    className="btn-reserve"
                    onClick={() => handleReserveClick(table.id)}
                  >
                    จองโต๊ะ
                  </button>
                </>
              )}
              {table.status === 'occupied' && (
                <>
                  <button className="btn-occupied" disabled>
                    ใช้งานอยู่
                  </button>
                  <button 
                    className="btn-add-order"
                    onClick={() => {
                      const order = orders.find(o => o.id === table.orderId);
                      if (order) {
                        setSelectedTableForAddOrder({ tableId: table.id, orderId: order.id });
                      }
                    }}
                  >
                    เพิ่มออเดอร์
                  </button>
                  <button 
                    className="btn-complete"
                    onClick={() => {
                      const order = orders.find(o => o.id === table.orderId);
                      if (order) {
                        handleCompleteOrder(table.number, order);
                      }
                    }}
                  >
                    ปิดออเดอร์
                  </button>
                </>
              )}
              {table.status === 'reserved' && (
                <button 
                  className="btn-release"
                  onClick={() => handleReleaseReservation(table.id)}
                >
                  ยกเลิกการจอง
                </button>
              )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTable && (
        <OrderModal 
          tableId={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}

      {selectedTableForAddOrder && (
        <OrderModal 
          tableId={selectedTableForAddOrder.tableId}
          existingOrderId={selectedTableForAddOrder.orderId}
          onClose={() => setSelectedTableForAddOrder(null)}
        />
      )}

      {showReserveModal && (
        <div className="modal-overlay" onClick={() => setShowReserveModal(false)}>
          <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
            <h3>จองโต๊ะที่ {reserveTableId}</h3>
            <input
              type="text"
              placeholder="ชื่อผู้จอง"
              value={reservedBy}
              onChange={(e) => setReservedBy(e.target.value)}
              className="reserve-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  confirmReserve();
                }
              }}
            />
            <div className="reserve-actions">
              <button onClick={confirmReserve} className="btn-confirm">ยืนยัน</button>
              <button onClick={() => setShowReserveModal(false)} className="btn-cancel">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          show={confirmModal.show}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          variant={confirmModal.variant}
        />
      )}
    </div>
  );
};

export default TableSelector;

