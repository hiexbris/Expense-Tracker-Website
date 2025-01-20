import React, { useState } from 'react';

function Drop(props){

    const [current, setCurrent] = useState('Sort By Time');
    const [drop, setDrop] = useState(false);
        
        function enabledrop(){
            setDrop(!drop)
        }
        function disabledrop(value){
            setDrop(false)
            setCurrent(value)
            if (value === 'Sort By Time'){
                props.sorttime()
            }
            else if (value === "Sort By Price"){
                props.sortprice()
            }
            else if (value === "Sort By Name"){
                props.sortname()
            }
        }

    return(
        <div className='dropbut1'>
            <button className='dropbutbut1' onClick={enabledrop}>
                <div>{current}</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
            </button>
            { drop && (
                <div className='dropbuting1'>
                    <button className='droping1' onClick={() => disabledrop('Sort By Time')}>Sort By Time</button>
                    <button className='droping1' onClick={() => disabledrop('Sort By Price')}>Sort By Price</button>
                    <button className='droping1' onClick={() => disabledrop('Sort By Name')}>Sort By Name</button>
                </div>
            )}
        </div>

    );
}

export default Drop;