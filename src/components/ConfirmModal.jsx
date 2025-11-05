import './ConfirmModal.css';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmText = 'ยืนยัน', cancelText = 'ยกเลิก', variant = 'default' }) => {
  if (!show) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-footer">
          {cancelText && (
            <button className="confirm-btn-cancel" onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button className={`confirm-btn-ok confirm-btn-${variant}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

