import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import {
    FaPlusCircle, FaEdit, FaRegCheckCircle, FaSave,
    FaRegLightbulb
} from 'react-icons/fa';
import { IoIosGlasses, IoIosArrowBack } from "react-icons/io";
import { FiActivity } from "react-icons/fi";
import Moment from 'react-moment';
import DatePicker from "react-datepicker";
import StyledTitleCard from '../components/StyledTitleCard';
import ColHeader from '../components/ColHeader'

import "react-datepicker/dist/react-datepicker.css";

const ProjectDash = (props) => {
    const params = useParams()
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        projectPage(params['id'])
    }, [])

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
        setStartDate(new Date())
        setEndDate(new Date())
    }
    const [show2, setShow2] = useState(false);
    const [task, setTask] = useState({})
    const handleClose2 = () => {
        setShow2(false);
        setVisible(false);
    }
    const handleShow2 = () => setShow2(true);

    const [visible, setVisible] = useState(false)

    const handleClick = (id, title, description, startdate, enddate, status, name, assignee_id) => {
        setStartDate(new Date(startdate))
        setEndDate(new Date(enddate))
        setTask({
            id: id,
            title: title,
            description: description,
            startdate: startdate,
            enddate: enddate,
            status: status,
            name: name,
            assignee_id: assignee_id,
        })
        setInput({
            title: title,
            description: description,
            status: status,
            startdate: startdate,
            enddate: enddate,
            name: name,
            assigned_id: assignee_id,
        })
        handleShow2()
    }

    const [input, setInput] = useState({
        title: "",
        description: "",
        status: "Open"
    })
    const handleOnChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
            startdate: startDate,
            enddate: endDate
        })
    }

    const handleSubmit = (e) => {
        const form = e.currentTarget;
        console.log('form.checkValidity()', form.checkValidity())

        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
            setValidated(true);
            setInput({
                title: e.target.title.value,
                description: e.target.description.value,
                startdate: startDate,
                enddate: endDate
            })
            return
        }
        e.preventDefault()
        return (createTask(e), handleClose())
    }
    const createTask = async (e) => {
        console.log('input in create task', input)
        const form = e.currentTarget;
        console.log('form.checkValidity()', form.checkValidity())
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
        }
        e.preventDefault()
        setValidated(true);
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/tasks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: project.id, input })
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                startdate: null,
                enddate: null,
            })
            setValidated(false)
            projectPage(params['id'])
        }
    }

    const handleEditSubmit = (e) => {

        const form = e.currentTarget;
        console.log('form.checkValidity()', form.checkValidity())

        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
            setValidated(true);
            return
        }
        e.preventDefault()
        setInput({
            title: e.target.title.value,
            description: e.target.description.value,
            status: e.target.status.value,
            // startdate: startDate,
            // enddate: endDate
        })
        return (editTask(e, startDate, endDate), handleClose2())
    }

    const editTask = async (e, startDate, endDate) => {
        console.log('input in edit task startDate and endDate', input, startDate, endDate)
        const form = e.currentTarget;
        console.log('form.checkValidity()', form.checkValidity())
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
        }
        e.preventDefault()
        setValidated(true);
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/edittasks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: task.id, input, startDate, endDate })
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                startdate: null,
                enddate: null,
            })
            setValidated(false)
            projectPage(params['id'])
        }
    }

    const projectPage = async (id) => {
        console.log('test', id)
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/project/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            if (data.success) {
                console.log('data LOIII ', data)
                setProject(data.project)
                if (data.tasks) {
                    setTasks(data.tasks)
                }
            }
        }
    }
    const openTasks = tasks.filter(function (task) {
        return task.status === "Open";
    });

    const inProgressTasks = tasks.filter(function (task) {
        return task.status === "In Progress";
    });

    const doneTasks = tasks.filter(function (task) {
        return task.status === "Done";
    });

    if (!project) return <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>


    const renderMainContent = () => {
        if (!visible) {
            return (
                <>
                    <Card>
                        <Card.Header className="d-flex justify-content-between" as="h3" >
                            <span><IoIosGlasses />{task.name}</span>
                            <span>{task.status}</span>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col className='task-modal-left col-8'>
                                    <Card.Title>{task.title}</Card.Title>
                                    <Card.Text>
                                        {task.description}
                                    </Card.Text>
                                    <Button variant="primary">Add a comment</Button>
                                </Col>
                                <Col className='col-4'>
                                    <Card.Text>
                                        Start Date: <Moment format="DD/MM/YYYY">{task.startdate}</Moment>
                                        <h6>Deadline: <Moment fromNow>{task.enddate}</Moment></h6>
                                    </Card.Text>

                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between" as="h3" ><span onClick={() => setVisible(!visible)}><FaEdit />Edit </span></Card.Footer>
                    </Card>
                </>
            )
        }

        const a = ["Open", "In Progress", "Done"].filter(e => e != task.status)
        // const allUsersFiltered = props.allUsers.filter(name => name != task.name)

        return (
            <>
                <Card>
                    <Form noValidate validated={validated} className="taskform " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleEditSubmit(e)}>
                        <Card.Header className="d-flex justify-content-between" as="h3" >
                            <span><IoIosGlasses />{task.name}</span>
                            <span>{task.status}</span>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col className='task-modal-left col-8'>
                                    <Form.Group controlId="formPlaintextEmail">
                                        <Form.Control required name="title" className='test h4' plaintext defaultValue={task.title} />
                                        <Form.Control.Feedback type="invalid">Every task needs a title!</Form.Control.Feedback>
                                        <Form.Control name="description" as="textarea" plaintext defaultValue={task.description} />
                                    </Form.Group >
                                </Col>
                                <Col className='col-4'>
                                    <Card.Text>
                                        <Form.Group controlId="formTaskStart">
                                            <Form.Label>Task Start Date</Form.Label>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={startDate}
                                                onChange={date => setStartDate(date)}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                todayButton="Today"
                                                locale="en-GB"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formTaskEnd">
                                            <Form.Label>Task Deadline</Form.Label>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={endDate}
                                                onChange={date => setEndDate(date)}
                                                selectsEnd
                                                endDate={endDate}
                                                minDate={startDate}
                                                todayButton="Today"
                                                locale="en-GB"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formStatus">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control name='status' as="select">
                                                <option>{task.status}</option>
                                                {a.map(v => <option>{v}</option>
                                                )}
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId="formAssigned">
                                            <Form.Control required name='assigned_id' as="select"  >
                                                <option selected value={task.assignee_id}>{task.name}</option>
                                                {props.allUsers.map(assignee => <option value={assignee.id}>{assignee.name}</option>
                                                )}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">Assign the task to someone</Form.Control.Feedback>
                                        </Form.Group>

                                    </Card.Text>

                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between" as="h3" ><span onClick={() => setVisible(!visible)}><IoIosArrowBack /></span> <Button type="submit" ><FaSave /> </Button></Card.Footer>

                    </Form >
                </Card>
            </>
        )
    }
    
    return (
        <>
            <div className="projectdash ">
                <Row className='m-0 ' >
                    <div className="title" >
                        <h1 > {project.title}  </h1>
                    </div>
                </Row>
                <Row className='m-0' >
                    <Col className='col-4 open text-center'>
                        <h3> <FaRegLightbulb />Open</h3>
                        <ColHeader />
                        {openTasks.map((task) => {
                            return (
                                <StyledTitleCard 
                                task={task}
                                handleClick={() => handleClick(task.id, task.title, task.description, task.startdate, task.enddate, task.status, task.assignee.name, task.assignee.id) }
                                />
                            )
                        })}
                        <Button variant="outline-primary" onClick={handleShow}  ><FaPlusCircle /> Task</Button>
                    </Col>
                    <Col className='col-4 open text-center'>
                        <h3> <FiActivity /> In Progress</h3>
                        <ColHeader />
                        {inProgressTasks.map((task) => {
                        return (
                            <StyledTitleCard 
                            task={task}
                            handleClick={() => handleClick(task.id, task.title, task.description, task.startdate, task.enddate, task.status, task.assignee.name, task.assignee.id) }
                            />
                        )
                        })}

                    </Col>
                    <Col className='col-4 open text-center'>
                        <h3><FaRegCheckCircle /> Done</h3>
                        <ColHeader />
                        {doneTasks.map((task) => (
                            <StyledTitleCard 
                            task={task}
                            handleClick={() => handleClick(task.id, task.title, task.description, task.startdate, task.enddate, task.status, task.assignee.name, task.assignee.id) }
                            />
                        )
                        )}
                    </Col>
                </Row>
            </div >
                        
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show} onHide={handleClose}>
                <Form noValidate validated={validated} className="taskform " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleSubmit(e)}>
                    <h4>Create a new task </h4>
                    <img
                        src="https://i.imgur.com/W9k8Ei6.png"
                        width="60"
                        height="60"
                        className="d-inline-block align-top"
                        alt="logo"
                    />
                    <Form.Group controlId="formtaskTitle">
                        <Form.Control required name="title" type="text" placeholder="Task Title (required)" />
                        <Form.Control.Feedback type="invalid">Every task needs a title!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formtaskDescription">
                        <Form.Control name="description" type="text" placeholder="Describe The Task" />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group controlId="formTaskStart">
                                <Form.Label>Task Start Date</Form.Label>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    todayButton="Today"
                                    locale="en-GB"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formTaskEnd">
                                <Form.Label>Task Deadline</Form.Label>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    endDate={endDate}
                                    minDate={startDate}
                                    todayButton="Today"
                                    locale="en-GB"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formAssigned">
                                <Form.Control required name='assigned_id' as="select"  >
                                <option disabled selected value="">Assign the task</option>
                                                {props.allUsers.map(assignee=><option value={assignee.id}>{assignee.name}</option>
)}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">Assign the task to someone</Form.Control.Feedback>
                            </Form.Group>
                    <Button block size="lg" variant="success" type="submit"  >
                        Create
                    </Button>
                </Form>
            </Modal>

            <Modal
                className='modal2'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show2} onHide={handleClose2}>
                {renderMainContent()}
            </Modal>
        </>
    );
}

export default ProjectDash