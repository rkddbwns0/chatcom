import axios from "axios"
import { useEffect, useState } from "react"
import { ChatRooms } from "../pages/chatRooms"

export const Rooms = () => {

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [chatRooms, setChatRooms] = useState<any>([])

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/chat_room/chat_list`, {
                    params: {
                        user_id: user?.user_id
                    },
                    withCredentials: true
                })
                console.log(response.data)
                setChatRooms(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchChatRooms()
    }, [])

    return (
        <div>
            {chatRooms.length > 0 ? (
                chatRooms.map((item: any) => (
                    <div key={item}>
                        <div>
                            {item.title}
                        </div>
                    </div>
                ))
            ) : (
                <div>채팅방이 없습니다.</div>
            )}
        </div>
    )
}
