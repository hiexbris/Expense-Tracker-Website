import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Sort from "./sort";
import { useNavigate } from 'react-router-dom';
import PieChart1 from './piechart1'
import PieChart2 from './piechart2'


function FirstBox(props){

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [data, setData] = useState([]);
    const [layer, setLayer] = useState(1);
    const [name, setName] = useState("Expenditure Tracker:");
    const [total, setTotal] = useState(0);
    const [sort, setSort] = useState('time');
    const [starttime, setstart] = useState(props.startime);
    const [endtime, setend] = useState(props.endtime);
    const [alltotal, setalltotal] = useState(0);

    function changeWidth(){

        const alltotal1 = data.reduce(function (accumulator, element) {
            return accumulator + element.total; 
        }, 0);

        setalltotal(alltotal1)

        setTimeout(function() {
            data.map(function (element) {
              const current = document.getElementById(element._id);
              if (current) {
                current.style.width = '0';
                const Width = ((element.total * 100) / alltotal1) + '%';
                current.style.width = Width;
              }
            });
          }, 0);
    };

    useEffect(function () {
        setstart(props.startime);
        setend(props.endtime);
        changeWidth();
        layer1(props.startime, props.endtime)
    }, [props.update, props.updaten, props.startime, props.endtime]);

    useEffect(function () {
        changeWidth();
    }, [data]);

    function sortname(){
        setSort('name')
        changelayer(name, total, 'name', starttime, endtime)
    }
    function sortprice(){
        setSort('price')
        changelayer(name, total, 'price', starttime, endtime)
    }
    function sorttime(){
        setSort('time')
        changelayer(name, total, 'time', starttime, endtime)
    }

    async function changelayer(name, total, sort, starttime, endtime){
        setLayer(2)
        try {
            const response = await axios.post(`http://localhost:5000/getrecord/${props.user}`, {
                starttime,
                endtime,
                name,
                sort
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Send token in the header
                },
            });
    
            if (response && response.data) {
                setName(name);
                setTotal(total);
                setData(response.data);
            }
        } catch {
            navigate('/login'); // Redirect to the login page
        }
    }

    async function layer1(starttime, endtime){
        setLayer(1)
        try {
            const response = await axios.post(`http://localhost:5000/total/${props.user}`, {
                starttime,
                endtime
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Send token in the header
                },
            });
    
            if (response && response.data) {
                setData(response.data);
                setName("Expenditure Tracker:");
            }
        } catch {
            navigate('/login'); // Redirect to the login page
        }
    }

    async function deletecat(name){
        const cat = name;
        try {
            const response = await axios.post(`http://localhost:5000/deletecat/${props.user}`, {
                cat
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Send token in the header
                },
            });
    
            if (response && response.data) {
                props.update1();
                props.update2();
            }
        } catch {
            navigate('/login'); // Redirect to the login page
        }
    }

    async function deleteitem(category, _id, price, sort){

        try {
            const response = await axios.post(`http://localhost:5000/deleteitem/${props.user}`, {
                category,
                _id,
                sort
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the header
                },
            });
    
            if (response && response.data) {
                setTotal(total - price);
                changelayer(category, total - price, sort, starttime, endtime);
            }
        } catch {
            navigate('/login'); // Redirect to the login page
        }
    }


    return(
        <div className="container">
            {layer == 1 && (
                <div className='piechart'>
                    <PieChart1 data={data} />
                </div>
            )}
            {layer == 2 && (
                <div className='piechart'>
                    <PieChart2 data={data} />
                </div>
            )}
            {layer === 1 && (
                <div className="expenditure">
                    <div className="solve">
                        <div className='gogo'>
                            <p>{name}</p>
                            <p>{alltotal}</p>
                        </div>  
                        <div className='elements'>
                            {data.map((element) => (
                                <div className='solve1'>
                                    <div className='catbut'>
                                        <button className='catbut' onClick={() => changelayer(element._id, element.total, sort, starttime, endtime)}>
                                            <p>{element._id}</p>
                                        </button>
                                        <div className='price_right'>
                                            <div className="linechange" id={element._id}></div>
                                            <div className='pta'>
                                                <p>{element.total}</p>
                                                <button className='trash trash_right' onClick={() => deletecat(element._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {layer === 2 && (
                <div className="expenditure">
                    <div className="solve">
                        <div className='row1'>
                            <p>{name}:</p>
                            <div className='cat_right'>
                                <Sort sorttime={sorttime} sortname={sortname} sortprice={sortprice}/>
                                <p>{total}</p>
                                <button className='bttrack' onClick={() => layer1(starttime, endtime)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className='elements2'>
                        {data.map((element) => (
                            <div className='hoga'>
                                <p>{element.name}</p>
                                <div className='rightcat'>
                                    <p>{element.price}</p>
                                    <button className='trash' onClick={() => deleteitem(name, element._id, element.price, sort)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FirstBox;



// <div className='sort'>
//                                 <button className='sortb' onClick={sorttime}>Sort By Time</button>
//                                 <button className='sortb' onClick={sortname}>Sort By Name</button>
//                                 <button className='sortb' onClick={sortprice}>Sort By Price</button>
//                             </div>