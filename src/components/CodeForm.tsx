import React, { useState } from 'react';
import '../assets/styles/CodeForm.css'
interface CodeFormProps {
  email: string;
  onVerify: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
}

const CodeForm: React.FC<CodeFormProps> = ({ 
  email, 
  onVerify, 
  onBack, 
  onResend 
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      alert('Vui lòng nhập đầy đủ 6 số mã xác thực!');
      return;
    }
    onVerify(fullCode);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('');
      const fullCode = [...newCode, ...Array(6 - newCode.length).fill('')];
      setCode(fullCode);
      const lastIndex = Math.min(pastedData.length - 1, 5);
      setTimeout(() => {
        const lastInput = document.getElementById(`code-input-${lastIndex}`) as HTMLInputElement;
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  return (
    <div className="code-form-container">
      <div className="code-form-header">
        <div className="code-form-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 className="code-form-title">NHẬP MÃ XÁC THỰC</h1>
        <p className="code-form-subtitle">
          Mã xác thực đã được gửi đến{' '}
          <span className="code-form-email">{email}</span>
        </p>
      </div>

      <div className="code-form-content">
        <div className="code-form-group">
          <label className="code-form-label">Mã xác thực</label>
          <div className="code-inputs-wrapper">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="code-input"
                autoComplete="off"
              />
            ))}
          </div>
        </div>

        <button onClick={handleVerify} className="code-btn-primary">
          XÁC THỰC
        </button>

        <div className="code-resend-wrapper">
          <span className="code-text-muted">Không nhận được mã?</span>
          <button onClick={onResend} className="code-link-button">
            Gửi lại mã
          </button>
        </div>

        <button onClick={onBack} className="code-btn-back">
          <svg className="code-back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default CodeForm;