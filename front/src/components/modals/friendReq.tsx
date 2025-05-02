import axios, { AxiosError } from "axios";
import React, { useState } from "react"
import "../../css/friendReq.css"

interface FriendReqProps {
    isOpen: boolean
    onClose: () => void;
}

export const FriendReq: React.FC<FriendReqProps> = ({isOpen, onClose}) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [email, setEmail] = useState<string>('')

    if (!isOpen) return null
    
    const handleRequest = async () => {
        if (email === '') {
            alert('이메일을 입력해 주세요.')
            return
        }

        if (!email.includes('@')) {
            alert('이메일 형식이 올바르지 않습니다.')
            setEmail('')
            return
        }

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
        }
    }

    return (
        <div onClick={onClose} className="friend-req-overlay">
            <div className="friend-req-container" onClick={(e) => e.stopPropagation()}>
                <div className="friend-req-header">
                    <div></div>
                    <h3 className="friend-req-title">친구 요청</h3>
                    <a onClick={onClose} className="friend-req-close-button">X</a>
                </div>
                <div className="friend-req-input-container">
                    <input type="text" placeholder="요청을 보낼 사용자의 이메일을 작성해 주세요." value={email} onChange={(e) => setEmail(e.target.value)} className="friend-req-input" />
                </div>
                <div className="friend-req-button-container">
                    <button onClick={handleRequest} className="friend-req-button">친구 요청하기</button>
                </div>
            </div>
        </div>
    )
}
