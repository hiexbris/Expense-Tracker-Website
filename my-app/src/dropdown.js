import React, {use, useEffect, useState} from 'react';


function DropDown(props){
    
    const [current, setCurrent] = useState('This Month');
    const [drop, setDrop] = useState(false);
    
    function enabledrop(){
        setDrop(!drop)
    }
    function disabledrop(value){
        setDrop(false)
        setCurrent(value)
    }
    
    useEffect(() => {
        const today = new Date();
        let startTime, endTime;
        const dayOfWeek = today.getDay();
    
        switch (current) {
            case "Today":
                startTime = new Date(today.setHours(0, 0, 0, 0));
                endTime = new Date(today.setHours(23, 59, 59, 999));
                break;
            case "This Week":
                startTime = new Date(today);
                startTime.setDate(today.getDate() - dayOfWeek); // Previous Sunday
                startTime.setHours(0, 0, 0, 0);
                endTime = new Date(startTime);
                endTime.setDate(startTime.getDate() + 6); // Saturday
                endTime.setHours(23, 59, 59, 999);
                break;
            case "Last Week":
                const lastWeekStart = new Date(today);
                lastWeekStart.setDate(today.getDate() - dayOfWeek - 7); // Previous Sunday of last week
                lastWeekStart.setHours(0, 0, 0, 0);
                startTime = lastWeekStart;
                endTime = new Date(startTime);
                endTime.setDate(startTime.getDate() + 6); // Saturday
                endTime.setHours(23, 59, 59, 999);
                break;
            case "This Month":
                startTime = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
                endTime = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
            case "Last Month":
                startTime = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
                endTime = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
                break;
            case "All Time":
                startTime = new Date(0); // Unix epoch start time
                endTime = new Date(); // Current time
                break;
            default:
                return; // No valid selection
        }
        props.changetime(startTime, endTime);
    }, [current]);

    return(
        <div className='dropbut'>
            <button className='dropbutbut' onClick={enabledrop}>
                <div>{current}</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
            </button>
            { drop && (
                <div className='dropbuting'>
                    <button className='droping' onClick={() => disabledrop('Today')}>Today</button>
                    <button className='droping' onClick={() => disabledrop('This Week')}>This Week</button>
                    <button className='droping' onClick={() => disabledrop('Last Week')}>Last Week</button>
                    <button className='droping' onClick={() => disabledrop('This Month')}>This Month</button>
                    <button className='droping' onClick={() => disabledrop('Last Month')}>Last Month</button>
                    <button className='droping' onClick={() => disabledrop('All Time')}>All Time</button>
                </div>
            )}
        </div>
    );
}

export default DropDown;