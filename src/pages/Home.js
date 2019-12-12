import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Card, Container , Button} from 'react-bootstrap';
import Calendar from '../components/Calendar';
import Projects from '../components/HomeProjects';
import StyledTitleCard from '../components/StyledTitleCard';
import ColHeader from '../components/ColHeader'
import Moment from 'react-moment';

import { IoIosGlasses} from "react-icons/io";
import {FaRegCopy, FaTrashAlt} from "react-icons/fa"


const moment = require('moment');
moment().format();

const Home = (props) => {
    const [projects, setProjects] = useState([])
    const [task, setTask] = useState([])
    const [tasks, setTasks] = useState([])
    const [show3, setShow3] = useState(false);
    const [input, setInput] = useState([])

    const STW = moment().endOf('isoweek')
    const SNW = moment().add(1, 'weeks').startOf('isoWeek')
    const ENW = moment().add(1, 'weeks').endOf('isoWeek')

    useEffect(() => {
        getProjects();
    }, [])

    useEffect(() => {
        getTasks();
    }, [])

    const getProjects = async () => {
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/getprojects`, {
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
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/gettasks`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            setTasks(data.tasks)
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
            name: task.assignee.name,
            assignee_id: task.assignee.id,
            project_title: task.project.title ,
            project_id: task.project.id
        })
        handleShow3()
    }

    const renderThisWeek = (tasks) => {
        return tasks.map(task => {
            if ((new Date(task.enddate) < STW._d && task.status==='Open') || (new Date(task.enddate) < STW._d && task.status==='In Progress')) return (<>
                <StyledTitleCard
                    task={task}
                    handleClick={() => handleClick(task)}
                />
            </>)
        })
    }

    const cloneTask = (task) => {
        const input= ({
            title: `${task.title} COPY`,
            description: task.description,
            startdate: SNW,
            enddate: ENW,
            status: "Open",
            assigned_id: task.assignee_id,
            project_title: task.project_title ,
            project_id: task.project_id
        })
        createTask(input)
    }

    const createTask = async (input) => {
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/tasks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: null, input })
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                startdate: null,
                enddate: null,
            })
            getTasks()
            handleClose3()
        }
    }

    const deleteTask = async (id) => {
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/deletetasks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id:id})
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                startdate: null,
                enddate: null,
            })
            getTasks()
            handleClose3()
        }
    }

    const taskModal = (task) => {
        return (
            <Card>
                <Card.Header className="d-flex justify-content-between" as="h4" >
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
                <Card.Footer className="d-flex justify-content-between modal-card-footer" as="h4" ><Button onClick={() => cloneTask(task)} ><FaRegCopy /> Clone </Button> <Button onClick={() => deleteTask(task.id)} ><FaTrashAlt />Delete</Button></Card.Footer>
            </Card>
        )
    }

    return (
        <>
            <Row className='m-0' style={{ height: '90vh' }}>
                <Col className='col-3 m-0 p-0 projects ' >
                    <Projects
                        user={props.user}
                        projects={projects}
                        getProjects={getProjects}
                    />
                </Col>

                <Col className='m-0 p-0 col-6' >
                    <Calendar />
                </Col>
                <Col className='m-0 p-0 home-task-feed col-3' >
                    <Container>
                    <h1>Tasks </h1>
                    <hr />
                    {/* <h2>CheckList</h2>
                    <hr />
                    <p> Create quick to dos and which can also become tasks </p> */}
                    <h2> Due this Week </h2>
                    <hr />
                    <ColHeader />
                    {renderThisWeek(tasks)}
                    </Container>
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