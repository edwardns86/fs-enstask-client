import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Card, Container, Button, ProgressBar, CardDeck } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import {FaRegLightbulb,FaRegCheckCircle, FaLongArrowAltRight} from 'react-icons/fa';
import { FiActivity } from "react-icons/fi";
import Moment from "react-moment"


export default function AllProjects() {
    useEffect(() => {
        getProjects();
    }, [])
    const [projects, setProjects] = useState([])
    const history = useHistory()
    
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
    
    return (
        <div className="display-flex">
            <h1> All Projects </h1>
            <Container>
            <CardDeck> 
            {projects.map((project) => (

                <Card onClick={() => history.push('/project/' + project.id)} className="project-card text-center">
                    <Card.Header ><h4>{project.title}</h4></Card.Header>
                        <Card.Body>{project.description}</Card.Body>
                        
                        <ProgressBar animated variant="success" now={project.task.filter((task) => task.status ==='Done').length / project.task.filter((task) => task.status !== "Archived").length*100} />
                            <Card.Body className="project-task-stats">
                                <Row>
                                    <Col><h4><FaRegLightbulb/> : {project.task.filter((task) => task.status ==='Open').length}</h4></Col>
                                    <Col><h4><FiActivity />: {project.task.filter((task) => task.status ==='In Progress').length}</h4></Col>
                                    <Col><h4><FaRegCheckCircle />  : {project.task.filter((task) => task.status ==='Done').length}</h4></Col>

                                </Row>
                            </Card.Body>
                    <Card.Footer className="project-card-footer">
                        <Row>
                            <Col className='col-5 text-center'>
                                <h6><Moment format="Do MMM">{project.startdate}</Moment></h6>
                            </Col>
                            <Col className='col-2 text-center'> 
                                <h6><FaLongArrowAltRight /></h6> 
                            </Col>
                            <Col className='col-5 text-center'>
                                <h6><Moment format="Do MMM">{project.enddate}</Moment></h6>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            )
            )}
            </CardDeck>
            </Container>

        </div>
    )
}
