import {useNavigate} from 'react-router-dom';

const Logout = (props) => {
    const { loggedIn, email } = props
    const navigate = useNavigate();
    console.log(props);
    if (loggedIn) {
        localStorage.removeItem('user');
        props.setLoggedIn(false);
        navigate('/');
    } else {
        navigate('/');
    }
}

export default Logout;