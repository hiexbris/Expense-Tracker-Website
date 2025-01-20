import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Cats(props){

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [data, setData] = useState([]);

    function add_cats_button(value){
      props.function(true, value)
    }

    useEffect(function () {
        axios.post(`http://localhost:5000/cat_name/${props.user}`,
        {}, 
        {
            headers: {
                Authorization: `Bearer ${token}` // Example of including the token from localStorage
            }
        }
        ).then(function (response) {
          setData(response.data);
        }).catch(function (error) {
          navigate('/login');
          console.error('Error fetching data:', error);
        });
    }, [props.update]);

    return(
        <div>
          <div className="add">
              {data.map((item, index) => (
              <button className="categories" onClick={() => add_cats_button(item)}>
                  <p>{item}</p>
              </button>
              ))}
              <button className="addcats" onClick={add_cats_button.bind(this, 'cats')}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                </svg>
              </button>
          </div>
        </div>
    );
}

export default Cats;