import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import '../assets/styles/EmailFormCompunent.css'
interface EmailFormProps {
  onSendCode: (email: string) => void;
  onShowPasswordLogin: () => void;
  onShowRegister: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ 
  onSendCode, 
  onShowPasswordLogin, 
  onShowRegister 
}) => {
  const [email, setEmail] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendCode = () => {
    if (!email) {
      alert('Vui lòng nhập email!');
      return;
    }
    if (!validateEmail(email)) {
      alert('Email không hợp lệ!');
      return;
    }
    
    onSendCode(email);
  };

  const handleGoogleLogin = () => {
    alert('Đăng nhập với Google');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendCode();
    }
  };

  return (
    <div className="email-form-container">
      <div className="email-form-header">
        <div className="email-form-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 className="email-form-title">ĐĂNG NHẬP</h1>
        <p className="email-form-subtitle">
          Nhập email của bạn để nhận mã xác thực
        </p>
      </div>

      <div className="email-form-content">
        <div className="email-form-group">
          <label className="email-form-label">Email</label>
          <div className="email-input-wrapper">
            <svg className="email-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập địa chỉ email"
              className="email-input-field"
            />
          </div>
        </div>

        <button onClick={handleSendCode} className="email-btn-primary">
          GỬI MÃ XÁC THỰC
        </button>

        <div className="email-divider">
          <span>Hoặc</span>
        </div>

        <button onClick={handleGoogleLogin} className="email-btn-google">
          <svg className="email-google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập với Google
        </button>

        <div className="email-footer-links">
          <button onClick={onShowPasswordLogin} className="email-link-button">
            Đăng nhập bằng mật khẩu
          </button>
          <span className="email-separator">•</span>
          <button onClick={onShowRegister} className="email-link-button">
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};
export default EmailForm