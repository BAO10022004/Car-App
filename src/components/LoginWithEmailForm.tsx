import React, { useState } from 'react';
import EmailForm from './EmailFormCompunent';
import CodeForm from './CodeForm';
import '../assets/styles/LoginWithEmailForm.css'
import SendCode from '../utils/apis/Auth/SendCode'; 
const LoginWithEmailForm: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<'email' | 'code'>('email');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleSendCode = (email: string) => {
    // setUserEmail(email);
    // setCurrentForm('code');
    const code =  SendCode(email)
    alert(`Mã xác thực đã được gửi đến ${email}` + code);
  };

  const handleVerify = (code: string) => {
    alert(`Xác thực thành công với mã: ${code}`);
    // Thực hiện đăng nhập tại đây
    console.log('Login with code:', code);
  };

  const handleBack = () => {
    setCurrentForm('email');
  };

  const handleResend = () => {
    if (userEmail) {
       const code =  SendCode(userEmail)
    alert(`Mã xác thực đã được gửi đến ${userEmail}` + code);
    }
  };

  const handleShowPasswordLogin = () => {
    alert('Chuyển sang form đăng nhập bằng mật khẩu');
    // Implement password login form
  };

  const handleShowRegister = () => {
    alert('Chuyển sang form đăng ký');
    // Implement register form
  };

  return (
    <div className="login-app-container">
      <div className="login-app-wrapper">
        <div className="login-app-card">
          {currentForm === 'email' ? (
            <EmailForm
              onSendCode={handleSendCode}
              onShowPasswordLogin={handleShowPasswordLogin}
              onShowRegister={handleShowRegister}
            />
          ) : (
            <CodeForm
              email={userEmail}
              onVerify={handleVerify}
              onBack={handleBack}
              onResend={handleResend}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginWithEmailForm;