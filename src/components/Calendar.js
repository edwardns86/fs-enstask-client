import React from 'react';
import { } from 'react-bootstrap';
import Moment from 'react-moment';
var moment = require('moment');
moment().format();


const MTW = moment().startOf('isoWeek').toString();
const STW = moment().endOf('isoweek').toString();
console.log("moment times Monday then Sunday", {
    MTW, STW
});

const Calendar = () => {
    return (
        <>
            <div className='snapshot'>
                <h1>Calendar Views</h1>
                <hr />
                
                <h2>These can be graphs view or calendar view or clear/  if non super-admin</h2>
                <h2>Stats View</h2>
                <p>last week sales </p>
                <p>web traffic stats , conversion rates  </p>
                <p>Social media stats </p>
                <p>graph with trends </p>
                <p>xero, shopify, analytics API? </p>
                <h2> Calendar View</h2>
                <p>display a calendar with current projects on and start and completion dates</p>
                <h2> User Tasks View</h2>
                <p>Display all tasks for a user in all statuses</p>

            </div>
        </>
    );
}

export default Calendar