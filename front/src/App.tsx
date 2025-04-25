import React, { useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes, useNavigate  } from 'react-router-dom';
import Index from './pages';
import { useUser } from './context/userContext';
import axios from 'axios';
import Home from './pages/home';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router';

function App() { 
  const context = useUser();
  return (
    <Router>
      <AppContent context={context} />
    </Router>
  )
}

const AppContent = ({context} : {context: any}) => { 
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`, {withCredentials: true})
        context?.setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
        navigate('/')
      }
    }
    fetchUser();
  }, [location.pathname, navigate]);

  return (
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/home' element={<Home />} />
      </Routes>
  );
}

export default App;
