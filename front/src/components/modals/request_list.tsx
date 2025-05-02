import axios from "axios"
import { useEffect, useState } from "react"
import "../../css/req_list.css"

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
        <div onClick={onClose} className="request-list-overlay">
            <div className="request-list-container" onClick={(e) => e.stopPropagation()}>
            {requestList.length > 0 ? (
                requestList.map((item: any) => (
                    <div key={item} className="request-list-item">
                        <div className="request-list-item-header">
                            <h3 className="request-list-item-header-title">친구 요청</h3>
                            <a onClick={onClose} className="request-list-item-close-button">X</a>
                        </div>
                        <div className="request-list-item-content">
                            <h3>{item.alias}({item.email})</h3>
                            <h3>님이 친구 요청을 보냈습니다.</h3>
                        </div>
                        <div className="request-list-item-button-container">
                            <button className="request-list-item-button">수락</button>
                            <button className="request-list-item-button">거절</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="request-list-item-empty">
                    <div className="request-list-item-empty-close-button-container">
                        <a onClick={onClose} className="request-list-item-empty-close-button">X</a>
                    </div>
                    <h3 className="request-list-item-empty-title">현재 친구 요청이 없습니다.</h3>
                </div>
            )}
           </div>
        </div>
    )
}
