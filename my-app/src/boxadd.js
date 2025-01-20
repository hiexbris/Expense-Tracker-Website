import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function BoxAdd(props){

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const itemRef = useRef(); 
    const priceRef = useRef(); 
    const newcatRef = useRef();

    function boxdis(){
        props.function(false, 'cats')
    }

    async function handlesubmit(){
        
        const uitem = itemRef.current.value;
        const uprice = priceRef.current.value;
        const cat = props.value;

        const Item = typeof uitem === 'string'
        ? uitem.replace(/\b\w/g, (char) => char.toUpperCase())
        : uitem;
        const Price = parseFloat(uprice);

        if (uitem.trim() && !isNaN(Price) && uprice.trim() === Price.toString()) {
            try {
                const response = await axios.post(`http://localhost:5000/spent/${props.user}`, {
                    cat,
                    Item,
                    Price,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Send token in the header
                    },
                });
            
                if (response && response.data) {
                    props.update1();
                    boxdis();
                }
            } catch (error) {
                navigate('/login');
            }
            
        }
        
        itemRef.current.value = '';
        priceRef.current.value = '';
    }

    async function addcats(){
        const unewcat = newcatRef.current.value;

        const newcat = typeof unewcat === 'string'
        ? unewcat.replace(/\b\w/g, (char) => char.toUpperCase())    
        : unewcat;

        if (unewcat.trim()) {
            try {
                const response = await axios.post(`http://localhost:5000/newcat/${props.user}`, {
                    newcat
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Send token in the header
                    },
                });
            
                if (response && response.data) {
                    props.update1();
                    props.update2();
                    boxdis();
                }
            } catch (error) {
                navigate('/login');
            }
        }
        newcatRef.current.value = '';
    }

    async function deletecat(){
        const cat = props.value;
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
                boxdis();
            }
        } catch (error) {
            navigate('/login');
        }
        
    }

    return(
        <div>
            <div className='blurall'></div>
            <div className='midbox'>
                <button className='cross' onClick={boxdis}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
                {props.value === 'cats' && (
                    <div className="inputflex">
                        <div className="textinside">Category</div>
                        <input type="text" className="textbox" placeholder="Enter text here" ref={newcatRef}/>

                        <div className='buttonflex'>
                            <button className='submit' onClick={addcats}>Submit</button>
                        </div>
                    </div>
                )}
                {props.value != 'cats' &&(
                <div className="inputflex">
                    <div className="textcat">{props.value}</div>

                    <div className="textcat">Item:</div>
                    <input type="text" className="textbox" placeholder="Enter text here" ref={itemRef} />

                    <div className="textcat">Price:</div>
                    <input type="text" className="textbox" placeholder="Enter text here" ref={priceRef} />
                    
                    <div className='buttonflex'>
                        <button className='submit' onClick={handlesubmit}>Submit</button>
                        <button className='submit'onClick={deletecat}>Delete</button>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default BoxAdd;