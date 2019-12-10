import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Card } from 'react-bootstrap';
import Calendar from '../components/Calendar';
import Projects from '../components/HomeProjects';
import StyledTitleCard from '../components/StyledTitleCard';
import Moment from 'react-moment';
import DatePicker from "react-datepicker";
import { IoIosGlasses, IoIosArrowBack } from "react-icons/io";
import { FaEdit } from 'react-icons/fa';


const moment = require('moment');
moment().format();


const Home = (props) => {
    const [projects, setProjects] = useState([])
    const [task, setTask] = useState([])
    const [tasks, setTasks] = useState([])
    const [show3, setShow3] = useState(false);

    const STW = moment().endOf('isoweek')

    useEffect(() => {
        getProjects();
    }, [])

    useEffect(() => {
        getTasks();
    }, [])

    console.log("current user",props.user)
    const getProjects = async () => {
        const resp = await fetch("https://127.0.0.1:5000/getprojects", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            setProjects(data)
        }
    }

    const getTasks = async () => {
        const resp = await fetch("https://127.0.0.1:5000/gettasks", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            setTasks(data)
        }
    }

    const handleShow3 = () => {
        setShow3(true);
    }
    const handleClose3 = () => setShow3(false);


    const handleClick = (task) => {
        setTask({
            id: task.id,
            title: task.title,
            description: task.description,
            startdate: task.startdate,
            enddate: task.enddate,
            status: task.status,
            // name: task.props.user.name,
            assignee_id: task.assignee_id,
        })
        handleShow3()
    }

    const renderThisWeek = (tasks) => {
        return tasks.map(task => {
            if (new Date(task.enddate) < STW._d) return (<>
                <StyledTitleCard
                    task={task}
                    handleClick={() => handleClick(task)}
                />
            </>)
        })
    }

    const taskModal = (task) => {
        return (
            <Card>
                <Card.Header className="d-flex justify-content-between" as="h3" >
                    <span><IoIosGlasses />{props.user.name}</span>
                    <span>{task.status}</span>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col className='task-modal-left col-8'>
                            <Card.Title>{task.title}</Card.Title>
                            <Card.Text>
                                {task.description}
                            </Card.Text>
                        </Col>
                        <Col className='col-4'>
                            <Card.Text>
                                Start Date: <Moment format="DD/MM/YYYY">{task.startdate}</Moment>
                                <h6>Deadline: <Moment fromNow>{task.enddate}</Moment></h6>
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between" as="h3" ><span> </span></Card.Footer>
            </Card>
        )
    }

    return (
        <>
            <Row className='m-0' style={{ height: '90vh' }}>
                <Col className='projects' md={2}>
                    <Projects
                        user={props.user}
                        projects={projects}
                        getProjects={getProjects}
                    />
                </Col>
                <Col md='10'>
                    <Row style={{ height: '100vh' }}>
                        <Col className='m-0 p-0' md={8}>
                            <Calendar />
                        </Col>
                        <Col className='home-task-feed' md={4}>
                            <h1>Tasks </h1>
                            
                            <hr />
                            <h2>CheckList</h2>
                            <hr />
                            <p> Create quick to dos and which can also become tasks </p>
                            <h2> Due this Week </h2>
                            <hr />
                            {renderThisWeek(tasks)}
                            {/* {tasks.map(task => {
                                return (
                                     // onClick={() => handleClick(task.id, task.title, task.description, task.startdate, task.enddate, task.status, task.assignee.name, task.assignee.id)} 
                                    <Card className="task-card m-2 text-center">
                                    <Card.Title 
                                    className="p-2" >{task.title}</Card.Title>
                                    </Card>
                                )})} */}
                            <p>Show current user due tasks and any uncompleted highlighted</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
                className='modal2'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show3} onHide={handleClose3}>
                {taskModal(task)}
            </Modal>

        </>
    );
}

export default Home