import React, {useState, useRef} from "react";
const Stopwatch = () => {
    const [time,setTime] = useState(0);
    const interval = useRef(null);
    const start = () => {
        setInterval(()=>{
            interval.current+=1;
        },1000);
    }
    const stop = () => {
        setTime(0);
    }
    return (
        <div>{time}</div>
    )
}

export default Stopwatch;