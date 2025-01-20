import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Cats from "./cats";
import FirstBox from "./firstbox";
import TextAdd from "./textadd";
import BoxAdd from "./boxadd";
import DropDown from "./dropdown";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserPage(){
    const { username } = useParams();
    const navigate = useNavigate();

    const today = new Date();
    const startTime = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    const endTime = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const [kiki, setData] = useState(false);
    const [value, setvalue] = useState(0);
    const [updateboxv, setUpdatebox] = useState(false);
    const [updatecatsv, setUpdatecats] = useState(false);
    const [starttime, setStart] = useState(startTime);
    const [endtime, setEnd] = useState(endTime);

    function logout(){
        localStorage.removeItem('authToken');
        navigate('/login');
    }

    function idk(box, change){
        setData(box)
        setvalue(change)
    }

    function time(start, end){
        setStart(start);
        setEnd(end);
    }

    function updatebox(){
        setUpdatebox(prevUpdate => !prevUpdate);
    }
    function updatecats(){
        setUpdatecats(prevUpdate => !prevUpdate);
    }

    if (kiki) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }

    const checkAuthentication = () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            navigate('/login');  // Redirect to login if token is not available
        }else {
            axios.post('http://localhost:5000/verify-token', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if (response.data.username != username) { 
                    navigate('/' + response.data.username)
                }
            })
            .catch((error) => {
                navigate('/login');
                console.log("Token verification failed:", error);
            });
        }
    }

    useEffect(() => {
        checkAuthentication(); 
        window.scrollTo(0, 0); // Scroll to the top
    }, []);

    return(
    <div>
        <img src="https://fontmeme.com/permalink/250101/c19fadb272891fb9dc0570520e462b85.png" className="logo" />
        {kiki &&(
            <BoxAdd value={value} function={idk} update1={updatebox} update2={updatecats} user={username}/>
        )}
        <DropDown changetime={time}/>
        <div>
            <div className='bada'>
                <FirstBox update={updateboxv} update1={updatebox} update2={updatecats} updaten={updatecatsv} startime={starttime} endtime={endtime} user={username}/>
                <TextAdd />
                <Cats function={idk} update={updatecatsv} user={username}/>
                <button className='lg' onClick={logout}>LOG OUT</button> 
            </div>
        </div>
    </div>
    );
}

export default UserPage;