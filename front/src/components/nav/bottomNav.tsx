import { Link } from "react-router-dom"

export const BottomNav = () => {

    return (
        <nav className="bottom-nav">
           <Link to='/home'>홈</Link>
           <Link to='/home/chatRooms'>채팅방</Link>
           <Link to='/home/myPage'>마이페이지</Link>
       </nav>
    )
}
