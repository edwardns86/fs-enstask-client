import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { GiMoneyStack } from 'react-icons/gi';
import { FaEtsy } from 'react-icons/fa';
import Tabletop from 'tabletop';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
    makeWidthFlexible,
    XAxis,
    YAxis,
    XYPlot,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries
} from 'react-vis';
var moment = require('moment');
moment().format();

const MTW = moment().startOf('isoWeek').toString();
const STW = moment().endOf('isoweek').toString();
const percentage = 66;
const FlexibleXYPlot = makeWidthFlexible(XYPlot);

const Calendar = () => {
    const [salesData, setSalesData] = useState([{ platform: '', wk1: 100 }])
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
                
                <Container className="stat-container align-center">
                <hr /> 
                    <Container>
                        <h4>This month sales</h4> 
                        <hr />
                    <Table className="table-striped table-hover" responsive>
                        <thead className='tableheader'>
                            <tr>
                                <th>Platform</th>
                                <th>Week 1</th>
                                <th>Week 2</th>
                                <th>Week 3</th>
                                <th>Week 4</th>
                            </tr>
                        </thead>
                        <tbody className='tablebody'>
                            {salesData.map((week => {
                                return (
                                    <tr>
                                        <td>{week.platform}</td>
                                        <td>£{week.wk1}</td>
                                        <td>£{week.wk2}</td>
                                        <td>£{week.wk3}</td>
                                        <td>£{week.wk4}</td>
                                    </tr>
                                )
                            }))}
                        </tbody>
                    </Table>
                    </Container>
                    <Row>
                        <Col>
                            <FlexibleXYPlot stackBy='y' className="barchart" margin={{ bottom: 70, left: 70 }} xType="ordinal"  colorType="category" height={300}>
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis tickLabelAngle={-45} />
                                <YAxis />
                                {salesData.map(p => {
                                    if (p.platform=== 'total') return
                                    return (
                                        <VerticalBarSeries
                                            cluster="stack 1"
                                            data={[
                                                { x: `Week 1`, y: p.wk1 },
                                                { x: 'Week 2', y: p.wk2},
                                                { x: 'Week 3', y: p.wk3},
                                                { x: 'Week 4', y: p.wk4},
                                            ]}
                                        />
                                    
                                    )
                                })}
                            </FlexibleXYPlot>
                        </Col>
                    </Row>
                    <hr /> 
                    <h4>Last week tasks</h4>
                    <hr /> 
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0.25,

                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',

                            // Text size
                            textSize: '16px',

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',

                            // Colors
                            pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                            textColor: '#f88',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                    />

                    
                    
                </Container>
                {/* <h2>These can be graphs view or calendar view or clear/  if non super-admin</h2>
                <h2>Stats View</h2>
                <p>last week sales </p>
                <p>web traffic stats , conversion rates  </p>
                <p>Social media stats </p>
                <p>graph with trends </p>
                <p>xero, shopify, analytics API? </p>
                <h2> Calendar View</h2>
                <p>display a calendar with current projects on and start and completion dates</p>
                <h2> User Tasks View</h2>
                <p>Display all tasks for a user in all statuses</p> */}

            </div>
        </>
    );
}

export default Calendar