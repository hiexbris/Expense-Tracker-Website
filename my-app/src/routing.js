import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import UserPage from './UserPage';
import SignUp from "./SignUp";
import { useEffect } from 'react';
import axios from "axios";


function ProtectedRoute() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');  
        if (token) {
            axios.post('http://localhost:5000/verify-token', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const { username } = response.data;
                if (username) {
                    navigate('/' + username);
                }
            })
            .catch((error) => {
                console.log("Token verification failed:", error);
            });
        }
    }, [navigate]);

    return null;
}

function App() {
    return (
        <Router>
            <ProtectedRoute /> 
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/:username" element={<UserPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;
