import axios from "axios";
import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router";

const Login = () => {
    const {setUser} = useUser();
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해 주세요.')
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
                email: email,
                password: password
            }, {withCredentials: true})
            setUser(response.data);
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
        <div className="login-container">
            <div className="login-container-title">
                <h2 className="login-container-title-text">ChatCom</h2>
                <p className="login-container-title-text-sub">사람들과 자유롭게 소통해 보아요!</p>
            </div>
            <div className="login-container-input-container">
                <input className="login-container-input" type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해 주세요."/>
                <input className="login-container-input" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해 주세요."/>
                <button className="login-container-button" onClick={handleLogin}>로그인</button>
            </div>
            <div className="login-container-signup-container">
                <p className="login-container-signup-text">아직 회원이 아니신가요?</p>
                <a className="login-container-signup-text-link" onClick={() => navigate('/signup')}>회원가입</a>
            </div>
        </div>
    )
}   

export default Login;