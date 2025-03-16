import React, {useState, useEffect} from 'react'

const CountdownTimer = ({endTime, onFinish}) => {
    const [remainingTime, setRemainingTime] = useState(endTime - Date.now());

    useEffect(()=>{
        if (remainingTime <= 0) {
            onFinish();  // Trigger finish callback if time runs out
            return;
        }

        const intervalId = setInterval(() => {
            const timeLeft = endTime - Date.now();
            setRemainingTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(intervalId);
                onFinish();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    },[endTime, remainingTime, onFinish]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

  return (
    <>
        <h2>CountdownTimer</h2>
        <div>
            {remainingTime > 0 ? (
                <span>{formatTime(remainingTime)}</span>
            ) : (
                <span>Finish</span>
            )}
        </div>
    </>
  )
}

export default CountdownTimer;