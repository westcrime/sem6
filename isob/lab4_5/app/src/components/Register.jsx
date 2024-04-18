import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [attemptCount, setAttemptCount] = useState(0);
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()

    const ipcRenderer = window.ipcRenderer;

    const onButtonClick = () => {
        // Set initial error values to empty
        setEmailError('')
        setPasswordError('')

        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email')
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            return
        }

        if ('' === password) {
            setPasswordError('Please enter a password')
            return
        }

        if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            return
        }
        const response = JSON.parse(ipcRenderer.sendSync('register', {email: email, password: password}));
        if (!response.success) {
            setEmailError('Error while creating jwt token');
        }
        const loginResponse = JSON.parse(ipcRenderer.sendSync('login', {email: email, password: password}));
        if (!loginResponse.success) {
            setAttemptCount(attemptCount + 1);
            setPasswordError(loginResponse.description)
            if (attemptCount >= 3) {
                setPasswordError('Too many invalid attemts: 30 sec delay');
                setTimeout(() => {
                    setAttemptCount(0); // Сбросить счетчик попыток после таймаута
                }, 30000); // 30 секунд блокировки
            }
            return;
        } else {
            console.log('Token received: ', loginResponse.token);
            localStorage.setItem('user', JSON.stringify({ email: email, token: loginResponse.token }));
            props.setLoggedIn(true);
            props.setEmail(email);
            navigate('/');
        }
    }

    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Register</div>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    type={"password"}
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Register'} />
            </div>
        </div>
    )
}

export default Register