import React, { useState } from 'react';
import { Car, Info, FileText, Database } from 'lucide-react';
import img from '../assets/images/images.jpg'
export default function HomePage() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  
  // URL ảnh nền - có thể thay đổi
  const [backgroundImage] = useState(img);

  const handleStart = () => {
    setIsStarted(true);
    setTimeout(() => {
      setIsStarted(false);
    }, 600);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setTimeout(() => {
      setActiveLink('');
    }, 300);
  };

  return (
    <div className="homepage">
      {/* Background Image với Blur */}
      <img 
        src={backgroundImage} 
        alt="background" 
        className="homepage-bg-image"
      />
      
      {/* Overlay */}
      <div className="homepage-bg-overlay"></div>

      <div className="homepage-container">
        <div className="card">
          {/* Header */}
          <div className="header">
            <Car className="header-icon" />
            <h1 className="header-title">CAR EVALUATION PREDICTOR</h1>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Description */}
          <p className="description">
            Công cụ dự đoán mức độ phù hợp của xe dựa trên đặc điểm kỹ thuật bằng mô hình học máy.
          </p>

          {/* Start Button */}
          <button 
            className={`start-button ${isStarted ? 'active' : ''}`}
            onClick={handleStart}
          >
            [ BẮT ĐẦU ]
          </button>

          {/* Bottom Links */}
          <div className="footer-links">
            <button 
              className={`link ${activeLink === 'intro' ? 'active' : ''}`}
              onClick={() => handleLinkClick('intro')}
            >
              <Info className="link-icon" />
              Giới thiệu
            </button>
            <span className="separator">–</span>
            <button 
              className={`link ${activeLink === 'guide' ? 'active' : ''}`}
              onClick={() => handleLinkClick('guide')}
            >
              <FileText className="link-icon" />
              Hướng dẫn
            </button>
            <span className="separator">–</span>
            <button 
              className={`link ${activeLink === 'data' ? 'active' : ''}`}
              onClick={() => handleLinkClick('data')}
            >
              <Database className="link-icon" />
              Tài liệu dữ liệu
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-info">
          <p>Powered by Machine Learning • UCI Car Evaluation Dataset</p>
        </div>
      </div>
    </div>
  );
}