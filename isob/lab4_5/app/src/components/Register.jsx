import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';

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

        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedPassword = DOMPurify.sanitize(password);

        if (email !== sanitizedEmail) {
            setEmailError('don\'t use dangerous symbols');
            return
        }
        // Check if the user has entered both fields correctly
        if ('' === sanitizedEmail) {
            setEmailError('Please enter your email')
            return
        }

        if ((sanitizedEmail.indexOf('\'') || sanitizedEmail.indexOf('"')) !== -1) {
            console.log('dangerous symbols: ', sanitizedEmail.indexOf('\'') || sanitizedEmail.indexOf('"'))
            setEmailError('No dangerous symbols pls')
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(sanitizedEmail)) {
            setEmailError('Please enter a valid email')
            return
        }

        if (sanitizedEmail.length > 20) {
            setEmailError('The email is too long')
            return
        }

        if (password !== sanitizedPassword) {
            setPasswordError('don\'t use dangerous symbols');
            return;
        }

        if ((sanitizedPassword.search('\'') || sanitizedPassword.indexOf('"')) !== -1) {
            setPasswordError('No dangerous symbols pls')
            return
        }

        if ('' === sanitizedPassword) {
            setPasswordError('Please enter a password')
            return
        }

        if (sanitizedPassword.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            return
        }

        if (sanitizedPassword.length > 20) {
            setPasswordError('The password is too long')
            return
        }

        const response = JSON.parse(ipcRenderer.sendSync('register', {email: sanitizedEmail, password: sanitizedPassword}));
        if (!response.success) {
            setEmailError('Error while creating jwt token');
        }
        const loginResponse = JSON.parse(ipcRenderer.sendSync('login', {email: sanitizedEmail, password: sanitizedPassword}));
        if (!loginResponse.success) {
            setAttemptCount(attemptCount + 1);
            setPasswordError(loginResponse.description)
            if (attemptCount >= 3) {
                document.getElementById('passwordError').value = 'Too many wrong attempts - 30 sec penalty';
                setTimeout(() => {
                    setAttemptCount(0); // Сбросить счетчик попыток после таймаута
                }, 30000); // 30 секунд блокировки
            }
            return;
        } else {
            console.log('Token received: ', loginResponse.token);
            const responseCheckAccount = JSON.parse(ipcRenderer.sendSync('checkAccount', {email: sanitizedEmail}));
            localStorage.setItem('user', JSON.stringify({ email: responseCheckAccount.email, token: loginResponse.token, role: responseCheckAccount.role }));
            props.setLoggedIn(true);
            props.setEmail(email);
            props.setRole(responseCheckAccount.role);
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
                <label className="errorLabel" id='passwordError'>{passwordError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Register'} />
            </div>
        </div>
    )
}

export default Register