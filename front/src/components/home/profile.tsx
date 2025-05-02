import { useUser } from "../../context/userContext"
import "../../css/home.css"

export const Profile = () => {
    const {user} = useUser()
    
    return (
        <div className="profile">
            <div className='profile-name'>
                <h3>{user?.name}</h3>
                <h3>({user?.nickname})</h3>
            </div>
            
            <div className='profile-email'>
                <h3>{user?.email}</h3>
            </div>
        </div>
    )
}
