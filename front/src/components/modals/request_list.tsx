import axios from "axios"
import { useEffect, useState } from "react"

export const RequestList: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => {

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [requestList, setRequestList] = useState<any>([])

    useEffect(() => {
        if (!user || !user?.user_id) {
            return
        }

        const fetchRequestList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/friends/request_list`, {
                    params: {user_id: user?.user_id},
                    withCredentials: true
                })
                setRequestList(response.data.data)
                console.log(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchRequestList()
    }, [])

    if (!isOpen) {
        return null
    }


    return (
        <div>
           {requestList.length > 0 ? (
            requestList.map((item: any) => (
                <div key={item}>
                    <div>
                        <h3>친구 요청</h3>
                        <a onClick={onClose}>X</a>
                    </div>
                    <div>
                        <h3>{item.alias}({item.email})</h3>
                        <h3>님이 친구 요청을 보냈습니다.</h3>
                    </div>
                    <div>
                        <button>수락</button>
                        <button>거절</button>
                    </div>
                </div>
            ))
           ) : (
            <div>
                <h3>친구 요청이 없습니다.</h3>
                <a onClick={onClose}>X</a>
            </div>
           )}
        </div>
    )
}
