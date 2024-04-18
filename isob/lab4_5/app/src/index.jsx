import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './components/Home.jsx';
import {Route, HashRouter, Routes} from "react-router-dom";
import NoPage from "./components/NoPage.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Posts from "./components/Posts.jsx";
import Register from "./components/Register.jsx";

export default function App() {
    const ipcRenderer = window.ipcRenderer;
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Fetch the user email and token from local storage
        const user = JSON.parse(localStorage.getItem('user'))
      
        // If the token/email does not exist, mark the user as logged out
        if (!user || !user.token) {
          setLoggedIn(false)
          return
        }
      
        // If the token exists, verify it with the auth server to see if it is valid
        ipcRenderer.send('verify', {token: user.token});
        ipcRenderer.on('verify', function (evt, message) {
            evt = JSON.parse(evt);
            setLoggedIn(evt.success);
            setEmail(user.email || '')
        });
    }, [])

    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} >
                    <Route path="/posts" element={<Posts email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
                    <Route path="/login" element={<Login email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                    <Route path="/logout" element={<Logout email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
                    <Route path="/register" element={<Register email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
                    <Route path="/*" element={<NoPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);