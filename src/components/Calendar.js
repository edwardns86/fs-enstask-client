import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import { GiMoneyStack } from 'react-icons/gi';
import { FaEtsy } from 'react-icons/fa';
import Tabletop from 'tabletop';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries
} from 'react-vis';
var moment = require('moment');
moment().format();

const MTW = moment().startOf('isoWeek').toString();
const STW = moment().endOf('isoweek').toString();


const Calendar = () => {
    const [salesData, setSalesData] = useState([{ Week: '' }])
    useEffect(() => {
        Tabletop.init({
            key: 'https://docs.google.com/spreadsheets/d/1dOV5A9OmnIAwtf2Y-FJcKTrKQj7Ffj0iW6kahnV6F7g/edit?folder=0AOcF2TQEVfhzUk9PVA#gid=0',
            parseNumbers: true,
            callback: googleData => {
                console.log('googleData', googleData)
                setSalesData(googleData)
            },
            simpleSheet: true
        })
    }, [])

    console.log(salesData)
    console.log(salesData[0].Week)

    return (
        <>
            <div className='snapshot'>
                <h1>Stats</h1>
                <hr />
                <Container>
                    <Table className="table-striped table-hover" responsive>
                        <thead className='tableheader'>
                            <tr>
                                <th>Week</th>
                                <th><GiMoneyStack />Cash</th>
                                <th><FaEtsy /></th>
                                <th>Shopify</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody className='tablebody'>
                            {salesData.map((week => {
                                return (
                                    <tr>
                                        <td>{week.Week}</td>
                                        <td>£{week.Cash}</td>
                                        <td>£{week.Etsy}</td>
                                        <td>£{week.Shopify}</td>
                                        <td>£{week.Total}</td>
                                    </tr>
                                )
                            }))}
                        </tbody>
                    </Table>

                    <XYPlot margin={{ bottom: 70 }} xType="ordinal" width={300} height={300}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis tickLabelAngle={-45} />
                        <YAxis />
                        {salesData.map(p => {
                            return (
                                <VerticalBarSeries
                                    data={[
                                        { x: 'Etsy', y: 10 },
                                        { x: 'Week 2', y: 5 },
                                        { x: 'Week 3', y: 15 }
                                    ]}
                                />
                            )
                        })}
                    </XYPlot>
                </Container>
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