import axios from "axios";
import React from "react";
import {  useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { Profile } from "../components/home/profile";
import { FriendsList } from "../components/home/friendsList";
import { FriendAndChatOptions } from "../components/home/friendAndChatOptions";

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
        <div>
            <div>
                <h1>ChatCom</h1>
                <a>마이페이지</a>
                <a onClick={handleLogout}>로그아웃</a>
            </div>
            <div>
                <FriendAndChatOptions />
            </div>
            <div>
                <Profile />
            </div>
            <div>
                <FriendsList />
            </div>
        </div>
    )
}       

export default Home;