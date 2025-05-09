import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';

export const ChatContent = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const location = useLocation();
    const slicedPath = location.pathname.slice('/chat/'.length);
    const [messages, setMessages] = useState<any>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat_log/chatList`, {
                    params: {
                        room_id: slicedPath,
                    },
                    withCredentials: true,
                });
                console.log(response.data);
                setMessages(response.data.chatList);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [user?.user_id]);
    return (
        <div>
            <h3>message</h3>
        </div>
    );
};
