import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form , Container, Jumbotron} from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import {
    FaRegCopy, FaEdit, FaRegCheckCircle, FaSave,
    FaRegLightbulb, FaTrashAlt
} from 'react-icons/fa';
import ReactTextFormat from 'react-text-format';
import { IoIosGlasses, IoIosArrowBack } from "react-icons/io";
import { FiActivity } from "react-icons/fi";
import Moment from 'react-moment';
import DatePicker from "react-datepicker";
import StyledTitleCard from '../components/StyledTitleCard';
import ColHeader from '../components/ColHeader'


export default function UserTasks(props) {
    const history = useHistory()
    const [show2, setShow2] = useState(false);
    const [tasks, setTasks] = useState([])
    const [task, setTask] = useState([])
    const [projects, setProjects] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [validated, setValidated] = useState(false);
    const [visible, setVisible] = useState(false)
    const [input, setInput] = useState({
        title: "",
        description: "",
        status: "Open"
    })
    const moment = require('moment');
    moment().format();

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

    const handleClose2 = () => {
        setShow2(false);
        setVisible(false);
    }
    const handleShow2 = () => setShow2(true);

    const handleEditSubmit = (e) => {

        const form = e.currentTarget;

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
        const form = e.currentTarget;
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
            getTasks()
        }
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
            handleClose2()
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
            handleClose2()
        }
    }

    const handleOnChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
            startdate: startDate,
            enddate: endDate
        })
    }

    const handleClick = (task) => {
        setStartDate(new Date(task.startdate))
        setEndDate(new Date(task.enddate))
        setTask({
            id: task.id,
            title: task.title,
            description: task.description,
            startdate: task.startdate,
            enddate: task.enddate,
            status: task.status,
            name: task.assignee.name,
            assignee_id: task.assignee.id,
            project_title: task.project.title,
            project_id: task.project.id
        })
        setInput({
            title: task.title,
            description: task.description,
            status: task.status,
            startdate: task.startdate,
            enddate: task.enddate,
            name: task.assignee.name,
            assigned_id: task.assignee.id,
            project_title: task.project.title,
            project_id: task.project.id
        })
        handleShow2()
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
            data.tasks.sort((a,b) => moment(a.enddate).format('YYYYMMDD')- moment(b.enddate).format('YYYYMMDD'))
            setTasks(data.tasks)
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

    const orderChange = doneTasks.sort((a,b) => moment(b.enddate).format('YYYYMMDD')- moment(a.enddate).format('YYYYMMDD'))

    const renderMainContent = () => {
        if (!visible) {
            return (
                <>
                    <Card className="modaltaskform">
                        <Card.Header className="d-flex justify-content-between modal-card-header" as="h4" >
                            <span><IoIosGlasses />{task.name}</span>
                            <span>{task.status}</span>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col className='task-modal-left col-8'>
                                    <Card.Title>{task.title}</Card.Title>
                                    <Card.Text>
                                        <ReactTextFormat>{task.description}</ReactTextFormat> 
                                    </Card.Text>
                                    <Button variant="primary"onClick={() => history.push('/project/' + task.project_id)} >{task.project_title}</Button>
                                </Col>
                                <Col className='col-4'>
                                    <Card.Text>
                                        Start Date: <Moment format="DD/MM/YYYY">{task.startdate}</Moment>
                                        <h6>Deadline: <Moment fromNow>{task.enddate}</Moment></h6>
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end modal-card-footer" as="h4" ><Button className="mr-2" onClick={() => setVisible(!visible)}><FaEdit />Edit </Button> <Button className="mr-2" onClick={() => cloneTask(task)} ><FaRegCopy /> Clone </Button> <Button className="mr-2" onClick={() => deleteTask(task.id)} ><FaTrashAlt />Delete</Button> </Card.Footer>
                    </Card>
                </>
            )
        }

        const a = ["Open", "In Progress", "Done"].filter(e => e !== task.status)
        // const allUsersFiltered = props.allUsers.filter(name => name != task.name)

        return (
            <>
                <Card className="modaltaskform">
                    <Form noValidate validated={validated} className="taskform " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleEditSubmit(e)}>
                        <Card.Header className="d-flex justify-content-between modal-card-header" as="h4" >
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
                                    <Form.Group controlId="formProject">
                                        <Form.Label>Project</Form.Label>
                                        <Form.Control name='project_id' as="select"  >
                                            <option selected value={task.project_id}>{task.project_title}</option>
                                            {projects.map(project => <option value={project.id}>{project.title}</option>
                                            )}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">Assign the task to a Project</Form.Control.Feedback>
                                    </Form.Group>

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
                                            <Form.Label>Assigned To</Form.Label>
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
                        <Card.Footer className="d-flex justify-content-between modal-card-footer" as="h4" ><span onClick={() => setVisible(!visible)}><IoIosArrowBack /></span> <Button type="submit" ><FaSave /> </Button></Card.Footer>

                    </Form >
                </Card>
            </>
        )
    }

    return (
        <>
            <div className="projectdash ">
                <Jumbotron className="Jumbotron" fluid>
                    <Container>
                        <h1>{props.user.name} </h1>
                        <p>
                        Below you can view all tasks that are currently assigned to you. 
                        </p>
                    </Container>
                </Jumbotron>
                <Row className='m-0' >
                    <Col xs={12} md={4} className=' open text-center'>
                        <h3> <FaRegLightbulb />Open</h3>
                        <ColHeader />
                        {openTasks.map((task) => {
                            return (
                                <StyledTitleCard
                                    key={task.id}
                                    task={task}
                                    handleClick={() => handleClick(task)}
                                />
                            )
                        })}
                        {/* <Button variant="outline-primary" onClick={handleShow}  ><FaPlusCircle /> Task</Button> */}
                    </Col>
                    <Col xs={12} md={4} className=' open text-center'>
                        <h3> <FiActivity /> In Progress</h3>
                        <ColHeader />
                        {inProgressTasks.map((task) => (
                            <StyledTitleCard
                                key={task.id}
                                task={task}
                                handleClick={() => handleClick(task)}
                            />
                        )
                        )}

                    </Col>
                    <Col xs={12} md={4} className=' open text-center'>
                        <h3><FaRegCheckCircle /> Done</h3>
                        <ColHeader />
                        {orderChange.map((task) => (
                            <StyledTitleCard
                                key={task.id}
                                task={task}
                                handleClick={() => handleClick(task)}
                            />
                        )
                        )}
                    </Col>
                </Row>
            </div >

            <Modal
                className='modal2'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show2} onHide={handleClose2}>
                {renderMainContent()}
            </Modal>
        </>
    )
}
