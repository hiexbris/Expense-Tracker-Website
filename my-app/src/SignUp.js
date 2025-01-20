import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const usernameRef = useRef(null);  // Initialize with `null` to ensure it works
    const passwordRef = useRef(null);
    const navigate = useNavigate();  // Used for navigation after successful signup

    const handleSignUp = async (e) => {
        e.preventDefault();

        const username = usernameRef.current ? usernameRef.current.value : '';
        const password = passwordRef.current ? passwordRef.current.value : '';

        try {
        const response = await axios.post('http://localhost:5000/signup', {
            username,
            password,
        });

        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            navigate('/' + username); // Redirect to login page
        } else {
            setError(response.data.message || 'Username already taken');
        }
        } catch (error) {
        console.error('Signup error:', error);
        setError('Username already in use');
        }
    };

    return (
        <div className='formmid'>
            <form onSubmit={handleSignUp} className="somthing">
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
                <button type="submit" className='lgo'>Sign Up</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <p className='link'>Already have a account?  <Link className='r' to="/login">Login</Link></p>
        </div>
    );
    }

export default SignUpPage;
