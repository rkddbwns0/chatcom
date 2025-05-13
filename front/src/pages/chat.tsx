import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import '../css/chat.css';
import axios from 'axios';
import { io } from 'socket.io-client';

export const Chat = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const location = useLocation();
    const slicedPath = location.pathname.slice('/chat/'.length);
    const title = location.state?.title;
    const [inputValue, setInputValue] = useState<string>('');
    const [messages, setMessages] = useState<any>([]);

    const socket = io('http://localhost:8000', {
        transports: ['websocket'],
        withCredentials: true,
        query: {
            user_id: user?.user_id,
            room_id: slicedPath,
        },
    });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat_log/chatList`, {
                    params: {
                        room_id: Number(slicedPath),
                    },
                    withCredentials: true,
                });
                setMessages(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [user?.user_id, slicedPath]);

    useEffect(() => {
        socket.on('message', (data) => {
            if (data.room_id === slicedPath) {
                setMessages((prev: any) => [...prev, data]);
            }
            console.log(data.room_id === slicedPath);
        });

        return () => {
            socket.off('message');
        };
    }, [slicedPath]);

    const handleMessage = () => {
        socket.emit('message', inputValue);
        setInputValue('');
    };

    return (
        <div className="chat-container">
            <div>
                <div className="chat-header">
                    <div>
                        <a href="/home/chatRooms" className="chat-header-back">
                            {'<'}
                        </a>
                    </div>
                    <div className="chat-title">
                        <h3 className="chat-title-text">{title}</h3>
                    </div>
                    <div></div>
                </div>
            </div>
            <div className="chat-content">
                {messages?.length > 0 ? (
                    messages.map((item: any) => (
                        <div key={item.id} className="chat-message">
                            {item.user_id === user?.user_id ? (
                                <div className="chat-message-right-container">
                                    <p className="chat-message-right">{item.message}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="chat-message-left">{item.message}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>
                        <p>메세지가 없습니다.</p>
                    </div>
                )}
            </div>
            <div>
                <div className="chat-input-container">
                    <textarea
                        className="chat-input"
                        placeholder="대화 내용을 입력해 주세요."
                        wrap="hard"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
                    />
                    <button className="chat-send-button" accessKey="Enter" onClick={handleMessage}>
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
};
