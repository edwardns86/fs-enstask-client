import React, { useState } from 'react';
import { FaPlusCircle, FaFilter } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap'
import { Redirect, useHistory } from 'react-router-dom'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Projects = (props) => {
    const history = useHistory()
    const [show, setShow] = useState(false);
    const [input, setInput] = useState({})
    const [validated, setValidated] = useState(false);

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
        console.log('form.checkValidity()', form.checkValidity())
        console.log('input', input)
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
            setValidated(true);
            console.log('e-target', e.target.title.value)
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
        const resp = await fetch("https://127.0.0.1:5000/newproject", {
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

    return (
        <>
            <h1>Projects</h1>
            <h6>  <FaFilter /></h6>
            <hr />
            <ul className="list" variant="flush">
                {props.projects.map((project) => (

                    <Card className="task-card m-2 text-center">
                        <Card.Title
                            className="p-2" onClick={() => history.push('/project/' + project.id)}>{project.title}</Card.Title>
                    </Card>
                    // <li className="listitem" onClick={() => history.push('/project/' + project.id)}> {project.title} </li>
                )
                )}
            </ul>
            <Button variant="primary" onClick={handleShow}>
                <FaPlusCircle /> Create a Project
            </Button>

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
        </>
    );
}

export default Projects

