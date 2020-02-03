import React, { useState } from 'react';
import { FaPlusCircle, FaFilter, FaRegEye } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col, Card, Container, Dropdown, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import DatePicker from "react-datepicker";


import "react-datepicker/dist/react-datepicker.css";

const Projects = (props) => {
    const history = useHistory()
    const [show, setShow] = useState(false);

    const [validated, setValidated] = useState(false);
    const [input, setInput] = useState({})
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());


    const handleClose = () => setShow(false);
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
                startdate: startDate,
                enddate: endDate
            })
            return
        }
        e.preventDefault()

        return (createProject(e), handleClose())
    }

    const createProject = async (e) => {

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
        }
        e.preventDefault()
        setValidated(true);
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/newproject`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(input)
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
            props.getProjects()
        }
    }

    const openProjects = props.projects.filter(function (project) {
        return project.status === "Open";
    });

    // const completeProjects = props.projects.filter(function (project) {
    //     return props.project.status === "Complete";
    // });


    return (
        <Container>
            <h1 href="/allprojects" >Projects</h1>
            <hr />
            <h4>All projects</h4>
            <hr />
            <div>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip-create-project">
                            <strong>Create Project</strong>.
                            </Tooltip>
                    }
                >
                    <Button className="m-2" variant="outline-primary" onClick={handleShow}>
                        <FaPlusCircle />
                    </Button>
                    </OverlayTrigger>
                    <Button className="m-2" variant="outline-primary" href='/allprojects'>
                        <FaRegEye />
                    </Button>
                    <Dropdown as={ButtonGroup} className="m-2" variant="outline-primary">
                        <Button variant="outline-primary" href='/'>
                            <FaFilter />
                        </Button>
                        <Dropdown.Toggle split id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Completed Projects</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Ending This Month</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
            </div>

                {openProjects.map((project) => (

                    <Card className="task-card  text-center">
                        <Card.Body
                            key={project.id} className="p-2" onClick={() => history.push('/project/' + project.id)}>{project.title}</Card.Body>
                    </Card>
                )
                )}

                <Modal

                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={show} onHide={handleClose}>

                    <Form noValidate validated={validated} className="projectform" onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleSubmit(e)}>
                        <h4>Create a new project </h4>
                        <img className="mb-4" src="/client/src/images/Logo.png'" alt="" width="72" height="72" />

                        <Form.Group controlId="formProjectTitle">
                            <Form.Control required name="title" type="text" placeholder="Project Title (required)" />
                            <Form.Control.Feedback type="invalid">Every project needs a title!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formProjectDescription">
                            <Form.Control required name="description" type="text" placeholder="Describe The Project" />
                            <Form.Control.Feedback type="invalid">Every project needs a description!</Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="formProjectStart">
                                    <Form.Label>Project Start Date</Form.Label>
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
                                <Form.Group controlId="formProjectEnd">
                                    <Form.Label>Project Deadline</Form.Label>
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
                        <Button block size="lg" variant="success" type="submit"  >
                            Create
                    </Button>
                    </Form>
                </Modal>
        </Container>
            );
        }
        
        export default Projects
        
