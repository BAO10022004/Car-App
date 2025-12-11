    import React, { useState } from 'react';
    import WelcomeCompunent from '../components/WelcomeCompunent'; 
    import img from '../assets/images/images.jpg'
    import { useNavigate } from 'react-router-dom';
    import '../assets/styles/HomePage.css'
    import LoginForm from '../components/LoginForm';
    import RegisterForm from '../components/RegisterForm';
    import LoginWithEmailForm from '../components/LoginWithEmailForm'
    export default function HomePage() {
    const [page, setPage] = useState(1);  
    const [isStarted, setIsStarted] = useState(false);
    const [activeLink, setActiveLink] = useState('');
        const navigate = useNavigate();

    // URL ảnh nền - có thể thay đổi
    const [backgroundImage] = useState(img);

    const handleStart = () => {
        setIsStarted(true);
        setTimeout(() => {
        setIsStarted(false);
        }, 600);
        navigate('/chatpage/')
        // setPage(2)
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
            {/* {page == 1 ?<WelcomeCompunent   activeLink={activeLink} 
                            handleLinkClick={handleLinkClick}
                            handleStart={handleStart}
                            isStarted={isStarted}  />:
            page == 2?<LoginWithEmailForm/> :
            page == 3?<LoginForm handleSubmit={()=> navigate("/chatpage/")} handleRegister={()=> setPage(3)}/>
            :<RegisterForm handleSubmitProps={()=>setPage(2)} handleLogin ={()=> setPage(2)}/>
            
             } */}
           <WelcomeCompunent   activeLink={activeLink} 
                            handleLinkClick={handleLinkClick}
                            handleStart={handleStart}
                            isStarted={isStarted}  />
          
                            {/* Footer */}
            <div className="footer-info">
            <p>Powered by Machine Learning • UCI Car Evaluation Dataset</p>
            </div>
            
        </div>
        </div>
    );
    }