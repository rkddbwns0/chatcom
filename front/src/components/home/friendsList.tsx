import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../css/home.css';

export const FriendsList = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [friends, setFriends] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.user_id) return;
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friends/friend_list`, {
                    params: { user_id: user.user_id },
                    withCredentials: true,
                });
                setFriends(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, [user?.user_id]);

    return (
        <div className="friends-list">
            <h2 className="friends-list-title">친구 목록</h2>
            {friends.length > 0 ? (
                friends.map((items: any) => (
                    <div key={items} className="friend-item">
                        <h3 className="friend-name">{items.friend_alias}</h3>
                        <h3 className="friend-email">({items.friend_email})</h3>
                    </div>
                ))
            ) : (
                <h3>친구 없음</h3>
            )}
        </div>
    );
};
