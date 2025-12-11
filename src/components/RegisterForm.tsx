import React, { useState,type FormEvent,type ChangeEvent } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react';
import '../assets/styles/RegisterForm.css';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}
interface LoginFormProps {
  handleSubmitProps?: () => void;
  handleLogin: ()=> void
}
const RegisterForm: React.FC<LoginFormProps> = ({ handleSubmitProps , handleLogin}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }
    
    handleSubmitProps
  };

  const handleGoogleRegister = (): void => {
    console.log('Google register clicked');
  };

  const handleInputChange = (field: keyof FormData) => (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData, [field]: value});
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          
          {/* Header */}
          <div className="register-header">
            <div className="register-icon">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="register-title">
              ĐĂNG KÝ
            </h1>
            <div className="register-divider"></div>
          </div>

          {/* Description */}
          <p className="register-description">
            Tạo tài khoản mới để bắt đầu sử dụng dịch vụ của chúng tôi.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                Họ và tên
              </label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  className="form-input"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="form-input"
                  placeholder="Nhập email"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">
                Số điện thoại
              </label>
              <div className="input-wrapper">
                <Phone className="input-icon" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>

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
                  onChange={handleInputChange('username')}
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
                  onChange={handleInputChange('password')}
                  className="form-input password-input"
                  placeholder="Nhập mật khẩu"
                  required
                  minLength={6}
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

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">
                Xác nhận mật khẩu
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className="form-input password-input"
                  placeholder="Nhập lại mật khẩu"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="terms-container">
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange('agreeTerms')}
                  className="terms-checkbox"
                  required
                />
                <span className="terms-text">
                  Tôi đồng ý với{' '}
                  <a href="#" className="terms-link">Điều khoản sử dụng</a>
                  {' '}và{' '}
                  <a href="#" className="terms-link">Chính sách bảo mật</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
            >
              ĐĂNG KÝ
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

            {/* Google Register */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="google-button"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng ký với Google
            </button>

          </form>

          {/* Login Link */}
          <div className="login-link-container">
            <span className="login-text">Đã có tài khoản? </span>
            <a href="#" className="login-link" onClick={handleLogin}>
              Đăng nhập ngay
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterForm