import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaFilter } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col , ListGroup } from 'react-bootstrap'

const Projects = (props) => {

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
        console.log('input', input)
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
        return (createProject(e), handleClose())
    }
    const createProject = async (e) => {
        console.log('input in create project', input)
        const form = e.currentTarget;
        console.log('form.checkValidity()', form.checkValidity())
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
        }
        e.preventDefault()
        setValidated(true);
        const resp = await fetch("https://127.0.0.1:5000/newproject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
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
            setValidated(false)  //push to project view wit            h its done, todo, doing etc 
        }
    }

    return (
        <>
            <h1>Projects</h1>
            <h6>  <FaFilter /></h6>
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
                        <Form.Control name="description" type="text" placeholder="Describe The Project" />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group controlId="formProjectStart">
                                <Form.Label>Project Start Date</Form.Label>
                                <Form.Control required name="startdate" type="date" placeholder="Start Date" />
                                <Form.Control.Feedback type="invalid">Every project needs a startdate</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formProjectEnd">
                                <Form.Label>Project Deadline</Form.Label>
                                <Form.Control required name="enddate" type="date" placeholder="End Date" />
                                <Form.Control.Feedback type="invalid">Every project needs a deadline</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button block size="lg" variant="success" type="submit"  >
                        Create
                    </Button>
                </Form>
            </Modal>
            <hr />
            <ul className="list" variant="flush"> 
                {props.projects.map((project) => (
                    <li className="listitem"  > {project.title} </li>
                )
                )}
            </ul>
        </>
    );
}

export default Projects

