import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Calendar from '../components/Calendar';
import Projects from '../components/HomeProjects';


const Home = (props) => {
    const [projects, setProjects] = useState([])
    useEffect(() => {
        getProjects();
    }, [])

    const getProjects = async () => {
        const resp = await fetch("https://127.0.0.1:5000/getprojects", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            console.log(data)
            setProjects(data)
        }
    }

    return (
        <>

            <Row className='m-0' style={{ height: '90vh' }}>
                <Col className='projects' md={2}>
                <Projects
                        user={props.user}
                        projects={projects}
                        getProjects={getProjects}
                    />
                </Col>
                <Col md='10'>
                    <Row style={{ height: '100vh' }}>
                        <Col className='m-0 p-0' md={8}>
                            <Calendar />
                        </Col>
                        <Col className='home-task-feed' md={4}>
                            <h1>User Tasks </h1>
                            <hr />
                            <h2>CheckList</h2>
                            <hr />
                            <p> Create quick to dos and which can also become tasks </p>
                            <h2> Due this Week </h2>
                            <hr />
                            <p>Show current user due tasks and any uncompleted highlighted</p>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </>
    );
}

export default Home