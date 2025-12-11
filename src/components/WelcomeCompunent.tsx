import{
Car,
Info,
FileText,
Database
}from 'lucide-react'
import '../assets/styles/WelcomeCompunent.css'

function WelcomeCompunent({isStarted,handleStart, activeLink, handleLinkClick }: {isStarted: boolean; handleStart: () => void; activeLink: string; handleLinkClick: (link: string) => void})
{
    return (
        
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
                Hướng dẫn
                </button>
                
            </div>
            </div>
    )
}
export default WelcomeCompunent