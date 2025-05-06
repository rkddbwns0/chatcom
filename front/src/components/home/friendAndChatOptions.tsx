import { useState } from 'react';
import { FriendReq } from '../modals/friendReq';
import { RequestList } from '../modals/request_list';
import '../../css/home.css';
import { AddChat } from '../modals/addChat';

export const FriendAndChatOptions = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isFriendReqOpen, setIsFriendReqOpen] = useState(false);
    const [isRequestListOpen, setIsRequestListOpen] = useState(false);
    const [isAddChatOpen, setIsAddChatOpen] = useState(false);

    return (
        <div className="friend-and-chat-options">
            <a onClick={() => setIsFriendReqOpen(true)}>친구 추가</a>
            <a onClick={() => setIsRequestListOpen(true)}>요청 정보</a>
            <a onClick={() => setIsAddChatOpen(true)}>+ 채팅방 생성</a>
            <FriendReq isOpen={isFriendReqOpen} onClose={() => setIsFriendReqOpen(false)} />
            <RequestList isOpen={isRequestListOpen} onClose={() => setIsRequestListOpen(false)} />
            <AddChat isOpen={isAddChatOpen} onClose={() => setIsAddChatOpen(false)} />
        </div>
    );
};
