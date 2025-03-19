import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime, onFinish }) => {

    const endTimee = new Date(endTime).getTime() - (5.5 * 60 * 60 * 1000);
    const [remainingTime, setRemainingTime] = useState(0); 

    useEffect(() => {
        const updateRemainingTime = () => {
            const timeLeft = endTimee - Date.now();
            setRemainingTime(Math.max(0, timeLeft));

            if (timeLeft <= 0) {
                clearInterval(intervalId);
                onFinish();
            }
        };

        updateRemainingTime(); // Run once immediately

        const intervalId = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(intervalId);

    }, [endTimee, onFinish]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (totalSeconds >= 86400) {
            return `${days} Days Remaining`;
        } else {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} Remaining`;
        }
    };

    return (
        <>
            <h2>CountdownTimer</h2>
            <div>
                {remainingTime > 0 ? (
                    <span>{formatTime(remainingTime)}</span>
                ) : (
                    <span>SOLD</span>
                )}
            </div>
        </>
    );
};

export default CountdownTimer;
