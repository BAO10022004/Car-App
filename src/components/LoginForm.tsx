import '../assets/styles/LoginForm.css'
import React, { useState,type FormEvent,type ChangeEvent } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
// import './LoginForm.css';

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  handleSubmit?: () => void;
   handleRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, handleRegister }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    rememberMe: false
  });



  const handleGoogleLogin = (): void => {
    console.log('Google login clicked');
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({...formData, username: e.target.value});
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({...formData, password: e.target.value});
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({...formData, rememberMe: e.target.checked});
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="login-title">
              ĐĂNG NHẬP
            </h1>
            <div className="login-divider"></div>
          </div>

          {/* Description */}
          <p className="login-description">
            Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* Username */}
            <div className="form-group">
              <label className="form-label">
                Tên đăng nhập
              </label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className="form-input"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                Mật khẩu
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="form-input password-input"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="remember-forgot">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleRememberMeChange}
                  className="remember-checkbox"
                />
                <span className="remember-text">
                  Lưu đăng nhập
                </span>
              </label>
              <a href="#" className="forgot-link">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
            >
              ĐĂNG NHẬP
            </button>

            {/* Divider */}
            <div className="divider-container">
              <div className="divider-line">
                <div className="divider-border"></div>
              </div>
              <div className="divider-text-wrapper">
                <span className="divider-text">Hoặc</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-button"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng nhập với Google
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="signup-container">
            <span className="signup-text">Chưa có tài khoản? </span>
            <a href="#" className="signup-link" onClick={handleRegister}>
              Đăng ký ngay
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginForm;