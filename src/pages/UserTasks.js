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


export default function UserTasks(props) {
    const [show2, setShow2] = useState(false);
    const [tasks, setTasks] = useState([])
    const [task, setTask] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [validated, setValidated] = useState(false);
    const [visible, setVisible] = useState(false)
    const [input, setInput] = useState({
        title: "",
        description: "",
        status: "Open"
    })

    useEffect(() => {
        getTasks();
    }, [])

    const handleClose2 = () => {
        setShow2(false);
        setVisible(false);
    }
    const handleShow2 = () => setShow2(true);


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
            getTasks()
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
    const openTasks = tasks.filter(function (task) {
        return task.status === "Open";
    });

    const inProgressTasks = tasks.filter(function (task) {
        return task.status === "In Progress";
    });

    const doneTasks = tasks.filter(function (task) {
        return task.status === "Done";
    });

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
                    <h1 > {props.user.name}  These are all your tasks</h1>
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
                    {/* <Button variant="outline-primary" onClick={handleShow}  ><FaPlusCircle /> Task</Button> */}
                </Col>
                <Col className='col-4 open text-center'>
                    <h3> <FiActivity /> In Progress</h3>
                    <ColHeader />
                    {inProgressTasks.map((task) => (
                        <StyledTitleCard 
                        task={task}
                        handleClick={() => handleClick(task.id, task.title, task.description, task.startdate, task.enddate, task.status, task.assignee.name, task.assignee.id) }
                        />
                    )
                    )}

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
                className='modal2'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show2} onHide={handleClose2}>
                {renderMainContent()}
            </Modal>
        </>
    )
}
