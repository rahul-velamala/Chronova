import React, { useEffect, useState, useRef } from 'react';
import './Clock.css';

const Clock: React.FC = () => {
    const [time, setTime] = useState<Date>(new Date());
    const requestRef = useRef<number>(0);

    const updateClock = () => {
        setTime(new Date());
        requestRef.current = requestAnimationFrame(updateClock);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateClock);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return { hours, minutes, seconds };
    };

    const { hours, minutes, seconds } = formatTime(time);

    return (
        <div className="clock-container">
            <div className="clock-time">
                <span className="clock-hours">{hours}</span>
                <span className="clock-separator">:</span>
                <span className="clock-minutes">{minutes}</span>
                <span className="clock-separator clock-separator-seconds">:</span>
                <span className="clock-seconds">{seconds}</span>
            </div>
            <div className="clock-date">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
};

export default Clock;
