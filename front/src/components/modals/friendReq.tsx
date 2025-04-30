import axios, { AxiosError } from "axios";
import React, { useState } from "react"

interface FriendReqProps {
    isOpen: boolean
    onClose: () => void;
}

export const FriendReq: React.FC<FriendReqProps> = ({isOpen, onClose}) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [email, setEmail] = useState<string>('')

    if (!isOpen) return null
    
    const handleRequest = async () => {
        console.log(user.user_id)
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/friends/send_request`, 
                {send_id: user?.user_id, receiver_id: email}, 
                {withCredentials: true}
            )
            console.log(response)
            alert(`${response.data.message}`)
            setEmail('')
            onClose()
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<{message : string}>
            alert(`${axiosError.response?.data?.message}`)
            setEmail('')
            onClose()
        }
    }

    return (
        <div>
            <div>
                <div>
                    <h3>친구 요청</h3>
                    <a onClick={onClose}>X</a>
                </div>
                <div>
                    <input type="text" placeholder="요청을 보낼 사용자의 이메일을 작성해 주세요." value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <button onClick={handleRequest}>친구 요청하기</button>
                </div>
            </div>
        </div>
    )
}
