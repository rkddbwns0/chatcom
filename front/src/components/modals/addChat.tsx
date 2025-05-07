import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../css/addChat.css';

export const AddChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [friendList, setFriendList] = useState<any>([]);
    const [checkedItems, setCheckedItems] = useState<any>({});

    const handleCheckboxChange = (friendId: string) => {
        setCheckedItems((prevCheckedItems: any) => ({
            ...prevCheckedItems,
            [friendId]: !prevCheckedItems[friendId],
        }));
        console.log(Object.keys(checkedItems));
    };

    const handleCreateChat = () => {
        const selectFriends = Object.keys(checkedItems).filter((key) => checkedItems[key]);

        if (selectFriends.length === 0) {
            alert('친구를 선택해 주세요.');
            return false;
        }
        try {
            const response = axios.post(
                `${process.env.REACT_APP_SERVER_URL}/chat_room/create`,
                {
                    user_id: [user?.user_id, ...Object.keys(checkedItems)],
                },
                { withCredentials: true }
            );
            alert('채팅방 생성에 성공하였습니다.');
            onClose();
        } catch (error) {
            console.error(error);
            alert('채팅방 생성에 실패하였습니다. 다시 시도해 주세요.');
        }
    };

    useEffect(() => {
        const fetchFriendList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friends/friend_list`, {
                    params: { user_id: user?.user_id },
                    withCredentials: true,
                });
                setFriendList(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFriendList();
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="addChat-overlay" onClick={onClose}>
            <div className="addChat-container" onClick={(e) => e.stopPropagation()}>
                <div className="addChat-header">
                    <div></div>
                    <h2 className="addChat-title">채팅방 생성</h2>
                    <h2 className="addChat-close" onClick={onClose}>
                        X
                    </h2>
                </div>
                <div className="addChat-list">
                    {friendList.length > 0 ? (
                        friendList.map((item: any) => (
                            <div className="addChat-item-container">
                                <div
                                    key={item.friend_user_id}
                                    className="addChat-item"
                                    onClick={() => handleCheckboxChange(item.friend_user_id)}
                                >
                                    <div className="addChat-item-info">
                                        <p className="addChat-item-name">
                                            {item.friend_alias} ({item.friend_email})
                                        </p>
                                        <input
                                            type="checkbox"
                                            className="addChat-checkbox"
                                            checked={!!checkedItems[item.friend_user_id]}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="create-chat-room">
                                    <button
                                        className="create-chat-room-button"
                                        onClick={() => {
                                            handleCreateChat();
                                        }}
                                    >
                                        채팅방 생성하기
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>초대 가능한 친구가 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
