import { ChatInterface } from '../interface/chatInterface';

export const ChatHeader = ({ title }: ChatInterface) => {
    return (
        <div>
            <div>
                <a>{'<'}</a>
            </div>
            <div className="chat-title">
                <h3>{title}</h3>
            </div>
            <div></div>
        </div>
    );
};
