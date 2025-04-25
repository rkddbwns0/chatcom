import { useState } from "react"
import { FriendReq } from "../modals/friendReq"

export const FriendAndChatOptions = () => {

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [isFriendReqOpen, setIsFriendReqOpen] = useState(false)

    return (
        <div>
            <a onClick={() => setIsFriendReqOpen(true)}>친구 추가</a>
            <a>요청 정보</a>
            <a>+ 채팅방 생성</a>
            <FriendReq isOpen={isFriendReqOpen} onClose={() => setIsFriendReqOpen(false)} />
        </div>
    )
}
