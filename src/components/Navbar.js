import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { GoGraph, GoCalendar, GoSearch, GoChecklist } from "react-icons/go";
import { FaHome, FaPlusCircle, FaUserCircle } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const Navi = (props) => {
    const k = window.location.pathname
    const pId = window.location.pathname.split("/project/")[1]
    console.log('===========', pId)
    // WORK FROM HERE I HAVE THE ID OF A PROJECT FOR CREATING TASKS IN NAVBAR BUT NEED TO GUARD AGAINST null OR inocrrect ID
    const [show, setShow] = useState(false);
    const [input, setInput] = useState({})
    const [validated, setValidated] = useState(false);
    const [tasks, setTasks] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleClose = () => {
        getTasks();
        setShow(false)};
    const handleShow = () => setShow(true);
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


        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
            setValidated(true);
            setInput({
                title: e.target.title.value,
                description: e.target.description.value,
                assigned_id: e.target.assigned_id.value,
                startdate: startDate,
                enddate: endDate
            })
            return
        }
        e.preventDefault()
        return (createTask(e), handleClose())
    }
    const createTask = async (e) => {
    
        const form = e.currentTarget;
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
            body: JSON.stringify({ id: null, input })
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                assigned_id: null,
                startdate: null,
                enddate: null,
            })
            setValidated(false)  
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
            setTasks(data)
        }
    }

    return (
        <>
            <Navbar md={12} className='navbar' bg="light" expand="lg" >
                <Navbar.Brand href="/"><img
                    src="https://i.imgur.com/W9k8Ei6.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="logo"
                />Hi, {props.user.name} </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav.Link className="nav-add-task ml-5" href="/"><FaHome /></Nav.Link>
                    <NavDropdown className="nav-add-task ml-5 mr-5" title={
                        <span><FaUserCircle /> </span>
                    } id="basic-nav-dropdown" >
                        <NavDropdown.Item href="#action/3.1">Take to Another View</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => props.doLogOut(props.user.user_id)} >Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Nav className=" ml-auto">
                        <Nav.Link className="nav-add-task ml-5" onClick={handleShow} href="#link"><FaPlusCircle /></Nav.Link>
                        <Nav.Link className="nav-add-task ml-5" href="/stats"><GoGraph /></Nav.Link>
                        <Nav.Link className="nav-add-task ml-5" href="/stats"><GoChecklist /></Nav.Link>
                        <Nav.Link className="nav-add-task ml-5" href="/"><GoCalendar /></Nav.Link>
                        <Nav.Link className="nav-add-task ml-5" href="#link"><GoSearch /></Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Navbar >

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show} onHide={handleClose}>
                <Form noValidate validated={validated} className="taskform" onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleSubmit(e)}>
                    <h4>Create a new task </h4>
                    <img className="mb-4" src="/client/src/images/Logo.png'" alt="" width="72" height="72" />

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
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formTaskEnd">
                                <Form.Label>Task Deadline</Form.Label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    endDate={endDate}
                                    minDate={startDate}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formAssigned">
                                <Form.Control required name='assigned_id' as="select"  >
                                <option disabled selected value="">Assign the task</option>
                                                {props.allUsers.map(assignee=><option value={assignee.id}>{assignee.name}</option>
)}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">Assign the task to someone</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button block size="lg" variant="success" type="submit"  >
                        Create
            </Button>
                </Form>
            </Modal>
        </>
    );
}

export default Navi