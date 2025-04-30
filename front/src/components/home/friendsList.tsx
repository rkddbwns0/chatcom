import axios from "axios"
import { useUser } from "../../context/userContext"
import { useEffect, useState } from "react"

export const FriendsList = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [friends, setFriends] = useState<any>([]);

    useEffect(() => {
        console.log(user)
        const fetchFriends = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friends/friend_list`, 
                {
                    params: {user_id: user?.user_id}, 
                    withCredentials: true
                }
            )
            setFriends(response.data.data)
        } catch (error) {
            console.error(error)
            }
        } 
        fetchFriends()
    }, [])

    return (
        <div>
            <h2>친구 목록</h2>
            {friends.length > 0 ? (
                friends.map((items: any) => (
                    <div key={items}>
                        <h3>{items.alias}</h3>
                    </div>
                ))
            ) : (
                <h3>친구 없음</h3>
            )}
        </div>
    )
}
