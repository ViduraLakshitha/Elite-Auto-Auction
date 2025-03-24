import React, { useEffect, useState } from 'react'
import { format, addMinutes } from 'date-fns'

export default function EndDate ({auction}) {
    const [endDate, setEndDate] = useState();
    useEffect(()=>{
        const date = new Date(auction.endDateTime);
        const newDate = addMinutes(date, -330);// Subtract 5 hours and 30 minutes (330 minutes)
        const formattedDate = format(new Date(newDate), "EEEE, MMMM d ");
        setEndDate(formattedDate)
    }, [auction._id])

    return(
        <div>
            <p>Ends On: {endDate}</p>
        </div>
    )
}