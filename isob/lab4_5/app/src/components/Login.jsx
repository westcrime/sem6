import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';

const Login = (props) => {
    const [email, setEmail] = useState('westcrime@gmail.com')
    const [password, setPassword] = useState('123456qw')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [attemptCount, setAttemptCount] = useState(0);

    const navigate = useNavigate()

    const ipcRenderer = window.ipcRenderer;

    const onButtonClick = () => {
        if (attemptCount >= 3) {
            // Блокировать кнопку входа или показать сообщение об ограничении попыток
            return;
        }
        // Set initial error values to empty
        setEmailError('')
        setPasswordError('')

        // Санитизация ввода
        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedPassword = DOMPurify.sanitize(password);
        console.log('sanitized email:', sanitizedEmail)


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

        if ('' === sanitizedPassword) {
            setPasswordError('Please enter a password')
            return
        }

        if ((sanitizedPassword.search('\'') || sanitizedPassword.indexOf('"')) !== -1) {
            setPasswordError('No dangerous symbols pls')
            return
        }

        if (sanitizedPassword.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            return
        }
        const response = JSON.parse(ipcRenderer.sendSync('login', {email: sanitizedEmail, password: sanitizedPassword}));
        if (!response.success) {
            setAttemptCount(attemptCount + 1); // Увеличиваем счетчик попыток при неудачном входе
            setPasswordError(response.description);
            if (attemptCount >= 3) {
                setPasswordError('Too many invalid attemts: 30 sec delay');
                setTimeout(() => {
                    setAttemptCount(0); // Сбросить счетчик попыток после таймаута
                }, 30000); // 30 секунд блокировки
            }
            return;
        } else {
            setAttemptCount(0); // Сбросить счетчик попыток при успешном входе
            console.log('Token received: ', response.token);
            localStorage.setItem('user', JSON.stringify({ email: sanitizedEmail, token: response.token }));
            props.setLoggedIn(true);
            props.setEmail(sanitizedEmail);
            navigate('/');
        }
    }

    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Login</div>
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
                <input className={'inputButton'} type="button" id="button" onClick={onButtonClick} value={'Log in'} />
            </div>
        </div>
    )
}

export default Login