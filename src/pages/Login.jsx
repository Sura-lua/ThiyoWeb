import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (success) {
      setShowSuccessModal(true);
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate('/admin');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>เข้าสู่ระบบ Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อผู้ใช้:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="admin123"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn">เข้าสู่ระบบ</button>
        </form>
        <button type="button" onClick={handleGoHome} className="home-btn">
          ไปหน้าแรก
        </button>
        {import.meta.env.DEV && (
          <div className="login-info">
            <small>Development Mode: Username: admin | Password: admin123</small>
          </div>
        )}
      </div>
      
      <ConfirmModal
        show={showSuccessModal}
        title="✅ เข้าสู่ระบบสำเร็จ"
        message="ยินดีต้อนรับสู่ระบบ Admin"
        onConfirm={handleSuccessConfirm}
        onCancel={handleSuccessConfirm}
        confirmText="ตกลง"
        cancelText=""
        variant="success"
      />
    </div>
  );
};

export default Login;

