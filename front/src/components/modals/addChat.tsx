import axios from 'axios';
import { useEffect, useState } from 'react';

export const AddChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [friendList, setFriendList] = useState<any>([]);

    useEffect(() => {
        const fetchFriendList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friends/friend_list`, {
                    params: { user_id: user?.user_id },
                    withCredentials: true,
                });
                console.log(user?.user_id);
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
        <div onClick={onClose}>
            <div>
                <h2>채팅방 생성</h2>
                <h2 onClick={onClose}>X</h2>
            </div>
            <div>
                {friendList.length > 0 ? (
                    friendList.map((item: any) => (
                        <div key={item}>
                            <div>
                                {item.alias}
                                {item.email}
                            </div>
                            <input type="checkbox" />
                        </div>
                    ))
                ) : (
                    <div>초대 가능한 친구가 없습니다.</div>
                )}
            </div>
        </div>
    );
};
