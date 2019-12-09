import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { FaPlusCircle, FaEdit } from 'react-icons/fa';
import Moment from 'react-moment';
import DatePicker from "react-datepicker";
 
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
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setStartDate(new Date())
        setEndDate(new Date())
}
    const [show2, setShow2] = useState(false);
    const [task, setTask] = useState({})
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [visible, setVisible] = useState(false)

    const handleClick = (id, title, description, startdate, enddate) => {
        setStartDate(new Date(startdate))
        setEndDate(new Date(enddate))
        setTask({
            id: id,
            title: title,
            description: description,
            startdate: startdate,
            enddate: enddate,
        })
        setInput({
            title: title,
            description: description,
            startdate: startdate,
            enddate: enddate
        })
        handleShow2()
    }

    const [input, setInput] = useState({
        title: "",
        description: ""
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
        const resp = await fetch("https://127.0.0.1:5000/tasks", {
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
            // setInput({
            //     title: e.target.title.value,
            //     description: e.target.description.value ,
            //     startdate: startDate,
            //     enddate: endDate
            // })
            return 
        }
        e.preventDefault()
        setInput({
            title: e.target.title.value,
            description: e.target.description.value ,
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
        const resp = await fetch("https://127.0.0.1:5000/edittasks", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: task.id, input , startDate, endDate})
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
    console.log("starttime endtime ",startDate, endDate)
    

    const projectPage = async (id) => {
        console.log('test', id)
        const resp = await fetch(`https://127.0.0.1:5000/project/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            if (data.success) {
                console.log('data', data)
                setProject(data.project)
                if (data.tasks) {
                    setTasks(data.tasks)
                }
            }
        }
    }
    console.log('object input atm', input)
    if (!project) return <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>


    const renderMainContent = () => {
        if (!visible) {
            return (
                <>
                <h1>{task.title}</h1>
                <h6>{task.description}</h6>
                <h6>Deadline: <Moment fromNow>{task.enddate}</Moment></h6> 
                </>
            )
        }
        return (
            <Form noValidate validated={validated} className="taskform " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleEditSubmit(e)}>

                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label  column sm="2">
                            Title:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control required  name="title" className='test' plaintext defaultValue={task.title} />
                            <Form.Control.Feedback type="invalid">Every task needs a title!</Form.Control.Feedback>
                        </Col>
                        <Form.Label column sm="2">
                            Description:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="description" plaintext defaultValue={task.description} />
                        </Col>
                        <Form.Label column sm="2">
                            Start:
                        </Form.Label>
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
                        <Button variant="outline-primary" type="submit">Save</Button>
                        <Button variant="outline-primary" onClick={() => setVisible(!visible)}  > Toggle readonly </Button>
                    
                    </Form.Group>
                </Form>
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
                        <h3>Open</h3>
                        <Card className=" m-2 text-center">
                            <Card.Title className="p-2" >This is some text within a card body. sdbFHHBDSs If it got really long it wouydld format...</Card.Title>
                        </Card>
                        {tasks.map((task) => (
                            <Card className="task-card m-2 text-center">
                                <Card.Title onClick={() => handleClick(task.id, task.title, task.description, task.startdate, task.enddate)} className="p-2" >{task.title}</Card.Title>
                            </Card>
                        )
                        )}
                        <Button variant="outline-primary" onClick={handleShow}  ><FaPlusCircle /> Task</Button>
                    </Col>
                    <Col className='col-4 open'>
                        <h3>In Progress</h3>
                        <Card className="text-left">
                            <Card.Title className="p-2" >This is some text within a card body. sdbFHHBDSs If it got really long it wouydld format...</Card.Title>
                        </Card>

                    </Col>
                    <Col className='col-4 open'>
                        <h3>Done</h3>
                        <Card className="text-center">
                            <Card.Title className="p-2" >This is some text within a card body. sdbFHHBDSs If it got really long it wouydld format...</Card.Title>
                        </Card>
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
                <Button variant="outline-primary" onClick={() => setVisible(!visible)}  > Toggle readonly </Button>
                        
            </Modal>
        </>
    );
}

export default ProjectDash