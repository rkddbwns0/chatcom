import axios from "axios";
import React from "react";
import {  useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { Profile } from "../components/home/profile";
import { FriendsList } from "../components/home/friendsList";
import { FriendAndChatOptions } from "../components/home/friendAndChatOptions";
import "../css/home.css";

const Home = () => {
    const navigate = useNavigate()
    const {user} = useUser()
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {user_id: user?.user_id}, {withCredentials: true})
            localStorage.clear()
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className="home-container">
            <div className="home-header">
                <div className="home-header-left">
                    <h2>ChatCom</h2>
                </div>
                
                <div className="home-header-right">
                    <a onClick={() => navigate('/mypage')}>마이페이지</a>
                    <a onClick={handleLogout}>로그아웃</a>
                </div>
            </div>
            <div className="friend-and-chat-options-container">
                <FriendAndChatOptions />
            </div>
            <div className="profile-container">
                <Profile />
            </div>
            <div className="friends-list-container">
                <FriendsList />
            </div>
        </div>
    )
}       

export default Home;