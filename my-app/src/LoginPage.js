import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useRef, useState } from 'react';

function LoginPage() {
    const usernameRef = useRef(null);  // Initialize with `null` to ensure it works
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    

    const handleLogin = async (e) => {
        e.preventDefault();

        // Ensure the refs are not null before accessing value
        const username = usernameRef.current ? usernameRef.current.value : '';
        const password = passwordRef.current ? passwordRef.current.value : '';

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });

            if (response.data.success) {
                localStorage.setItem('authToken', response.data.token )
                navigate("/" + username);
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid Credentials');
        }
    };

    return (
        <div className='formmid'>
            <form onSubmit={handleLogin} className="somthing">
                <p className='i'>Please enter your details:</p>
                <input className='buttonlg'
                    type="text"
                    placeholder="Username"
                    ref={usernameRef}
                    required
                />
                <input className='buttonlg'
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                    required
                />
                <button type="submit" className='lgo'>Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <p className='link'>Don't have a account? <Link className='r' to="/signup">Create Account</Link></p>
        </div>
    );
}

export default LoginPage;
