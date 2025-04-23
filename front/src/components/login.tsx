import axios from "axios";
import React, { useContext, useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router";

const Login = () => {
    const {setUser} = useUser();
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
                email: email,
                password: password
            }, {withCredentials: true})
            
            navigate('/home')
        } catch (e) {
            if(axios.isAxiosError(e) && e.response) {
                const errorMessage = e.response.data.message;
                alert(errorMessage);
            } else {
                alert('로그인 과정에서 오류가 발생하였습니다. 다시 시도해 주세요.')
            }
        }
    }

    return (
        <div>
            <div>
                <h2>ChatCom</h2>
                <p>사람들과 자유롭게 소통해 보아요!</p>
            </div>
            <div>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>로그인</button>
            </div>
            <div>
                <p>아직 회원이 아니신가요?</p>
                <a>회원가입</a>
            </div>
        </div>
    )
}   

export default Login;