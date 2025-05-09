import { useNavigate } from 'react-router';
import { ChatContent } from '../components/chat/chatContent';
import { ChatHeader } from '../components/chat/chatHeader';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { ChatInput } from '../components/chat/chatInput';

export const Chat = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const location = useLocation();
    const slicedPath = location.pathname.slice('/chat/'.length);
    const title = location.state?.title;

    useEffect(() => {
        console.log(location.state?.title);
    }, []);

    return (
        <div>
            <div>
                <ChatHeader title={title} />
            </div>
            <div>
                <ChatContent />
            </div>
            <div>
                <ChatInput /> 
            </div>
        </div>
    );
};
