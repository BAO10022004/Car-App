import './assets/styles/App.css'
import './pages/HomePage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
     <BrowserRouter basename="/">
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Booking Page - ✅ SỬA: Thêm URL params :venueId/:categoryId */}
        <Route path="/chatpage/" element={<ChatPage />} />

      </Routes>
    </BrowserRouter>
  )
}
export default App
