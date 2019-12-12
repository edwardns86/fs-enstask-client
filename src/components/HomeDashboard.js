import React from 'react';
import { } from 'react-bootstrap';
import Tabletop from 'tabletop';


const HomeDashBoard = () => {
    const [googleSheet, setGoogleSheet] = useState([])

    useEffect(() => {
        Tabletop.init({
            key: '1dOV5A9OmnIAwtf2Y-FJcKTrKQj7Ffj0iW6kahnV6F7',
            callback: googleData => {
            console.log('google sheet data --->', googleData)
            },
            simpleSheet: true
        })
        
    }, [])

    return (
        <>
            <div className='snapshot'>
                <h1>Business Snapshot Views</h1>
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
            </div>
        </>
    );
}

export default HomeDashBoard