import { useState } from "react"
import { FriendReq } from "../modals/friendReq"
import { RequestList } from "../modals/request_list"
import "../../css/home.css"


export const FriendAndChatOptions = () => {

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [isFriendReqOpen, setIsFriendReqOpen] = useState(false)
    const [isRequestListOpen, setIsRequestListOpen] = useState(false)

    return (
        <div className="friend-and-chat-options">
            <a onClick={() => setIsFriendReqOpen(true)}>친구 추가</a>
            <a onClick={() => setIsRequestListOpen(true)}>요청 정보</a>
            <a>+ 채팅방 생성</a>
            <FriendReq isOpen={isFriendReqOpen} onClose={() => setIsFriendReqOpen(false)} />
            <RequestList isOpen={isRequestListOpen} onClose={() => setIsRequestListOpen(false)} />
        </div>
    )
}
