import React ,{useState} from "react";
import { Navbar, Nav, NavDropdown, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { GoGraph, GoCalendar, GoSearch } from "react-icons/go";
import { FaPlusCircle, FaUserCircle } from 'react-icons/fa';


const Navi = (props) => {
    const [show, setShow] = useState(false);
    const [input, setInput] = useState({})
    const [validated, setValidated] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOnChange = (e) => {

        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        const form = e.currentTarget;
        console.log('form.checkValidity()', form.checkValidity())

        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
            setValidated(true);
            console.log('e-target', e.target.title.value)
            setInput({
                title: e.target.title.value,
                description: e.target.description.value,
                startdate: e.target.startdate.value,
                enddate: e.target.enddate.value,
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
            body: JSON.stringify({id: null, input})
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                startdate: null,
                enddate: null,
            })
            setValidated(false)  //push to project view wit            h its done, todo, doing etc 
        }
    }


    return (
        <>
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
                    <Form.Group controlId="formtaskStart">
                        <Form.Label>Task Start Date</Form.Label>
                        <Form.Control required name="startdate" type="date" placeholder="Start Date" />
                        <Form.Control.Feedback type="invalid">Every task needs a startdate</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formtaskEnd">
                        <Form.Label>Task Deadline</Form.Label>
                        <Form.Control required name="enddate" type="date" placeholder="End Date" />
                        <Form.Control.Feedback type="invalid">Every task needs a deadline</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Button block size="lg" variant="success" type="submit"  >
                Create
            </Button>
        </Form>
    </Modal>

        <Navbar md={12} className='navbar' bg="light" expand="lg" >

            <Navbar.Brand href="#home"><img
                src="https://i.imgur.com/W9k8Ei6.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="logo"
            />Hi, {props.user.name} </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
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
                    <Nav.Link className="nav-add-task ml-5" href="/"><GoCalendar /></Nav.Link>
                    <Nav.Link className="nav-add-task ml-5" href="#link"><GoSearch /></Nav.Link>
                    
                </Nav>
            </Navbar.Collapse>
        </Navbar >
        </>
    );
}

export default Navi