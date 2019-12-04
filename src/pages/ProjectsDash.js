import React, { useEffect, useState } from 'react';
import { Row, Col, Card , Button} from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { FaPlusCircle} from 'react-icons/fa';

const ProjectDash = (props) => {
    const params = useParams()
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        projectPage(params['id'])
    }, [])

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
    console.log('object', tasks)
    if (!project) return <div className="d-flex justify-content-center align-items-center" style={{height:'90vh' }}>
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
    return (
        <>
            <div className="projectdash ">
                <Row className='m-0 ' >
                    <div className="title" >
                        <h1 > {project.title}</h1>
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
                                <Card.Title className="p-2" >{task.title}</Card.Title>
                            </Card>
                        )
                        )}
                        <Button variant="outline-primary"><FaPlusCircle /> Task</Button>
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
        </>
    );
}

export default ProjectDash