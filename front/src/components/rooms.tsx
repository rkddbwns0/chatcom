import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/chat_room.css';
import { useNavigate } from 'react-router';

export const Rooms = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState<any>([]);
    const [lastMessage, setLastMessage] = useState<any>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat_room/chat_list`, {
                    params: {
                        user_id: user?.user_id,
                    },
                    withCredentials: true,
                });
                console.log(response.data);
                setChatRooms(response.data.chatList);
                setLastMessage(response.data.lastMessage);
            } catch (error) {
                console.error(error);
            }
        };
        fetchChatRooms();
    }, []);

    const mergedChatRooms = chatRooms.map((room: any) => {
        const lastMsg = Array.isArray(lastMessage)
            ? lastMessage.find((msg: any) => msg.room_id === room.room_id)
            : null;
        return {
            ...room,
            lastMessage: lastMsg?.message || null,
            lastMessageTime: lastMsg?.timestamp || null,
        };
    });

    return (
        <div className="rooms-container">
            <div>
                <h3>채팅</h3>
            </div>
            <div className="rooms-list">
                {mergedChatRooms.length > 0 ? (
                    mergedChatRooms.map((item: any) => (
                        <div
                            key={item}
                            className="room-item"
                            onClick={() => navigate(`/chat/${item.room_id}`, { state: { title: item.title } })}
                        >
                            <div className="room-image"></div>
                            <div className="room-content">
                                <div className="room-title">
                                    {item.title} {item.chat_type === 'group' ? <span>{item.count}</span> : null}
                                </div>
                                <div className="room-message">
                                    {item.lastMessageTime ? `${item.lastMessage}` : '대화 내용이 없습니다.'}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>채팅방이 없습니다.</div>
                )}
            </div>
        </div>
    );
};
