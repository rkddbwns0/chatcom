import React, { useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Index from './pages';
import { useUser } from './context/userContext';
import axios from 'axios';
import Home from './pages/home';
import { useLocation } from 'react-router';
import MainLayout from './pages/mainLayout';
import { ChatRooms } from './pages/chatRooms';
import { Chat } from './pages/chat';

function App() {
    const context = useUser();
    return (
        <Router>
            <AppContent context={context} />
        </Router>
    );
}

const AppContent = ({ context }: { context: any }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`, {
                    withCredentials: true,
                });
                context?.setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        localStorage.removeItem('user');
                        navigate('/');
                    }
                }
                console.log(error);
                localStorage.removeItem('user');
                navigate('/');
            }
        };
        fetchUser();
    }, [location.pathname, navigate]);

    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat/:room_id" element={<Chat />} />
            <Route path="/home" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="chatRooms" element={<ChatRooms />} />
            </Route>
        </Routes>
    );
};

export default App;
