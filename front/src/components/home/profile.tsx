import { useUser } from "../../context/userContext"

export const Profile = () => {
    const {user} = useUser()
    return (
        <div>
            <div>
                <h3>{user?.name}</h3>
                <h3>({user?.nickname})</h3>
            </div>
            <div>
                <h3>{user?.email}</h3>
            </div>
        </div>
    )
}
