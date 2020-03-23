import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import {FaRegLightbulb,FaRegCheckCircle} from 'react-icons/fa';
import { FiActivity } from "react-icons/fi";
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


const FlexibleXYPlot = makeWidthFlexible(XYPlot);
const STW = moment().endOf('isoweek')
const SNW = moment().add(1, 'weeks').startOf('isoWeek')
const ENW = moment().add(1, 'weeks').endOf('isoWeek')
const SLW = moment().subtract(1, 'weeks').startOf('isoWeek')
const ELW = moment().subtract(1, 'weeks').endOf('isoWeek')

const Calendar = (props) => {
    const [salesData, setSalesData] = useState([{ platform: '', wk1: 100 }])
    useEffect(() => {
        Tabletop.init({
            key: 'https://docs.google.com/spreadsheets/d/1dOV5A9OmnIAwtf2Y-FJcKTrKQj7Ffj0iW6kahnV6F7g/edit?folder=0AOcF2TQEVfhzUk9PVA#gid=0',
            parseNumbers: true,
            callback: googleData => {
                setSalesData(googleData)
            },
            simpleSheet: true
        })
    }, [])


// TOTAL ARRAYS 
const totalTasks = props.tasks.filter(function (task) {
    return task.status !== "Archived"
});

const openTasks = props.tasks.filter(function (task) {
    return task.status === "Open";
});

const inProgressTasks = props.tasks.filter(function (task) {
    return task.status === "In Progress";
});

const doneTasks = props.tasks.filter(function (task) {
    return task.status === "Done";
});

// LAST WEEK ARRAYS 

const lwTotalTasks = totalTasks.filter(function (task){
    if ((new Date(task.enddate) < ELW._d &&  new Date(task.enddate) > SLW._d) )
    return <p>All last week</p>
});

const lwOpenTasks = openTasks.filter(function (task){
    if ((new Date(task.enddate) < ELW._d &&  new Date(task.enddate) > SLW._d) )
    return <p>Stil open</p>
});

const lwInProgressTasks = inProgressTasks.filter(function (task){
    if ((new Date(task.enddate) < ELW._d &&  new Date(task.enddate) > SLW._d) )
    return <p>Still in Progress</p>
});

const lwDoneTasks = doneTasks.filter(function (task){
    if ((new Date(task.enddate) < ELW._d &&  new Date(task.enddate) > SLW._d) )
    return <p>Completed</p>
});

const lwDoneTasksLength = (lwDoneTasks.length)
const lwTotalTasksLength = (lwTotalTasks.length)
const lwOpenTasksLength = (lwOpenTasks.length)
const lwInProgressTasksLength = (lwInProgressTasks.length)

const donePercentage = (lwDoneTasksLength*100/lwTotalTasksLength);

const openPercentage = (lwOpenTasksLength*100/lwTotalTasksLength);

const inProgressPercentage = (lwInProgressTasksLength*100/lwTotalTasksLength);

    return (
        <>
            <div className='snapshot'>
                <h1>Stats</h1>
                
                <Container className="stat-container align-center">
                <hr /> 
                    <Container>
                        <h4>Sales</h4> 
                        <hr />
                    <Table className="table-striped table-hover" responsive>
                        <thead className='tableheader'>
                            <tr>
                                <th>Platform</th>
                                <th>Week 12</th>
                                <th>Week 11</th>
                                <th>Week 10</th>
                                <th>Week 9</th>
                                <th>Week 8</th>
                                <th>Week 7</th>
                                <th>Week 6</th>
                                <th>Week 5</th>
                                <th>Week 4</th>
                                <th>Week 3</th>
                                <th>Week 2</th>
                                <th>Week 1</th>
                            </tr>
                        </thead>
                        <tbody className='tablebody'>
                            {salesData.map((week => {
                                return (
                                    <tr>
                                        <td>{week.platform}</td>
                                        <td>£{week.wk12}</td>
                                        <td>£{week.wk11}</td>
                                        <td>£{week.wk10}</td>
                                        <td>£{week.wk9}</td>
                                        <td>£{week.wk8}</td>
                                        <td>£{week.wk7}</td>
                                        <td>£{week.wk6}</td>
                                        <td>£{week.wk5}</td>
                                        <td>£{week.wk4}</td>
                                        <td>£{week.wk3}</td>
                                        <td>£{week.wk2}</td>
                                        <td>£{week.wk1}</td>
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
                                                { x: 'Week 5', y: p.wk5},
                                                { x: 'Week 6', y: p.wk6},
                                                { x: 'Week 7', y: p.wk7},
                                                { x: 'Week 8', y: p.wk8},
                                                { x: 'Week 9', y: p.wk9},
                                                { x: 'Week 10', y: p.wk10},
                                                { x: 'Week 11', y: p.wk11},
                                                { x: 'Week 12', y: p.wk12},
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
                    <Container>
                    {/* <Row>
                        <Col className="not-started"><h4>Not Started</h4></Col>
                        <Col className="still-in-p"><h4>Still In Progress</h4></Col>
                        <Col className="lwcomplete"> <h4>Completed</h4></Col>
                    </Row> */}
                    <Row>
                        <Col className="not-started" ><h4><FaRegLightbulb /></h4></Col>
                        <Col className="still-in-p"><h4><FiActivity /></h4></Col>
                        <Col className="lwcomplete"><h4><FaRegCheckCircle /></h4></Col>
                    </Row>
                    <Row>
                        <Col className="not-started" ><h4>{lwOpenTasks.length}</h4></Col>
                        <Col className="still-in-p"><h4>{lwInProgressTasks.length}</h4></Col>
                        <Col className="lwcomplete"><h4>{lwDoneTasks.length}</h4></Col>
                    </Row>
                    </Container>
                    <Container className="circular-progress-bar" >
                    <Row>
                        <Col>
                        <CircularProgressbar
                        value={openPercentage}
                        text={`${openPercentage.toFixed(0)}%`}
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
                            pathColor: `rgba(145, 173, 194, ${openPercentage / 100})`,
                            textColor: '#91adc2',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#95c595',
                        })} 
                    />
                        </Col>
                        <Col>
                        <CircularProgressbar
                        value={inProgressPercentage}
                        text={`${inProgressPercentage.toFixed(0)}%`}
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
                            pathColor: `rgba(245, 195, 108, ${inProgressPercentage / 100})`,
                            textColor: '#f5c36c',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#95c595',
                        })} 
                    />
                        </Col>
                        <Col>
                        <CircularProgressbar
                        value={donePercentage}
                        text={`${donePercentage.toFixed(0)}%`}
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
                            pathColor: `rgba(149, 197, 149, ${donePercentage / 100})`,
                            textColor: '#95c595',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#95c595',
                        })} 
                    />
                        </Col>
                        
                    </Row>    
                    
                    </Container>

                    
                    
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