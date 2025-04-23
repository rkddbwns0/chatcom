import React, { useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes, useNavigate  } from 'react-router-dom';
import Index from './pages';
import { UserProvider, useUser } from './context/userContext';
import axios from 'axios';
import Home from './pages/home';

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/me`, {withCredentials: true})

        console.log(response)
        context?.setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [context.setUser, navigate]);

  // useEffect(() => {
  //   if (context.user === null) {
  //     navigate('/')
  //   }
  // }, [context.user, navigate])

  return (
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/home' element={<Home />} />
      </Routes>
  );
}

export default App;
