import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form , ProgressBar, Jumbotron, Container} from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import {
    FaPlusCircle, FaEdit, FaRegCheckCircle, FaSave,
    FaRegLightbulb, FaLongArrowAltRight , FaTrashAlt, FaRegCopy
} from 'react-icons/fa';
import ReactTextFormat from 'react-text-format';
import { IoIosGlasses, IoIosArrowBack } from "react-icons/io";
import { FiActivity } from "react-icons/fi";
import Moment from 'react-moment';
import DatePicker from "react-datepicker";
import StyledTitleCard from '../components/StyledTitleCard';
import ColHeader from '../components/ColHeader'
import "react-datepicker/dist/react-datepicker.css";


const moment = require('moment');
moment().format();

const ProjectDash = (props) => {
    const params = useParams()
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [validated, setValidated] = useState(false);
    const SNW = moment().add(1, 'weeks').startOf('isoWeek')
    const ENW = moment().add(1, 'weeks').endOf('isoWeek')

    useEffect(() => {
        projectPage(params['id'])
    }, [])

    const [input, setInput] = useState({
        title: "",
        description: "",
        status: "Open",
        // assigned_id: null,
        // project_id: null,

    })

    useEffect(() => {
        getProjects();
    }, [])
    
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
   

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
        setStartDate(new Date())
        setEndDate(new Date())
    }
    const [show2, setShow2] = useState(false);
    const [task, setTask] = useState({})
    const handleClose2 = () => {
        setShow2(false);
        setVisible(false);
    }
    const handleShow2 = () => setShow2(true);

// FUNCTIONS FOR THE EDIT PROJECT MODAL 
    const handleShow3 = () => {
        setStartDate(new Date(project.startdate))
        setEndDate(new Date(project.enddate))
        setInput({
            title: project.title,
            description: project.description,
            status: project.status,
        })
        setShow3(true);}
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => {
        setShow3(false);
    }

    const handleEditProjectSubmit = (e) => {
        const form = e.currentTarget;
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
            status: e.target.status.value
        })
        return (editProject(e, startDate, endDate), handleClose3())
    }

    const editProject = async (e, startDate, endDate) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation();
        }
        e.preventDefault()
        setValidated(true);
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/editprojects`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: project.id, input, startDate, endDate })
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


// above all edit project functions 

    const cloneTask = (task) => {
        const input= ({
            title: `${task.title} COPY`,
            description: task.description,
            startdate: SNW,
            enddate: ENW,
            status: "Open",
            assigned_id: task.assignee_id,
            project_title: task.project_title ,
            project_id: task.project_id
        })
        createCloneTask(input)
    }

    const createCloneTask = async (input) => {
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
                startdate: null,
                enddate: null,
            })
            projectPage(params['id'])
        }
    }
    


    const [visible, setVisible] = useState(false)

    const handleClick = (task) => {
        setStartDate(new Date(task.startdate))
        setEndDate(new Date(task.enddate))
        setTask({
            id: task.id,
            title: task.title,
            description: task.description,
            startdate: task.startdate,
            enddate: task.enddate,
            status: task.status,
            name: task.assignee.name,
            assignee_id: task.assignee.id,
            project_title: task.project.title,
            project_id: task.project.id
        })
        setInput({
            title: task.title,
            description: task.description,
            status: task.status,
            startdate: task.startdate,
            enddate: task.enddate,
            name: task.assignee.name,
            assigned_id: task.assignee.id,
            project_title: task.project.title,
            project_id: task.project.id
        })
        handleShow2()
    }

    const deleteTask = async (id) => {
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/deletetasks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id:id})
        })
        const data = await resp.json()
        if (data.success) {
            setInput({
                title: '',
                description: '',
                startdate: null,
                enddate: null,
            })
            projectPage(params['id'])
            handleClose2()
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
                project_id: e.target.project_id.value,
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
        })
        return (editTask(e, startDate, endDate), handleClose2())
    }

    const editTask = async (e, startDate, endDate) => {
        const form = e.currentTarget;
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
            projectPage(params['id'])
        }
    }

    const projectPage = async (id) => {
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/project/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        if (resp.ok) {
            const data = await resp.json()
            if (data.success) {
                setProject(data.project)
                if (data.tasks) {
                    data.tasks.sort((a,b) => moment(a.enddate).format('YYYYMMDD')- moment(b.enddate).format('YYYYMMDD')) 
                    setTasks(data.tasks)
                }
            }
        }
    }
    

    const totalTasks = tasks.filter(function (task) {
        return task.status !== "Archived"
    });

    const openTasks = tasks.filter(function (task) {
        return task.status === "Open";
    });

    const inProgressTasks = tasks.filter(function (task) {
        return task.status === "In Progress";
    });

    const doneTasks = tasks.filter(function (task) {
        return task.status === "Done";
    });

  

    if (!project) return <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>


    const renderMainContent = () => {
        if (!visible) {
            return (
                <>
                    <Card className="modaltaskform">
                        <Card.Header className="d-flex justify-content-between modal-card-header" as="h4" >
                            <span><IoIosGlasses />{task.name}</span>
                            <span>{task.status}</span>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col className='task-modal-left col-8'>
                                    <Card.Title>{task.title}</Card.Title>
                                    <Card.Text>
                                    <ReactTextFormat> {task.description} </ReactTextFormat>
                                    </Card.Text>
                                    {/* <Button variant="primary">Add a comment</Button> A Feature to add.  */}
                                </Col>
                                <Col className='col-4'>
                                    <Card.Text>
                                        Start Date: <Moment format="DD/MM/YYYY">{task.startdate}</Moment>
                                        <h6>Deadline: <Moment fromNow>{task.enddate}</Moment></h6>
                                    </Card.Text>

                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end modal-card-footer" as="h4" ><Button className="mr-2" onClick={() => cloneTask(task)} ><FaRegCopy /> Clone </Button> <Button className="mr-2" onClick={() => setVisible(!visible)}><FaEdit />Edit </Button> <Button className="mr-2" onClick={() => deleteTask(task.id)} ><FaTrashAlt />Delete</Button> </Card.Footer>
                    </Card>
                </>
            )
        }

        const a = ["Open", "In Progress", "Done"].filter(e => e != task.status)
        // const allUsersFiltered = props.allUsers.filter(name => name != task.name)
        
        return (
            <>
                <Card className="modaltaskform ">
                    <Form noValidate validated={validated} className="modaltaskform " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleEditSubmit(e)}>
                        <Card.Header className="d-flex justify-content-between modal-card-header" as="h4" >
                            <span><IoIosGlasses />{task.name}</span>
                            <span>{task.status}</span>
                        </Card.Header>
                        <Card.Body className="modal-card-body">
                            <Row>
                                <Col className='task-modal-left col-8'>
                                    <Form.Group controlId="formPlaintextEmail">
                                        <Form.Control required name="title" className='test h4' plaintext defaultValue={task.title} />
                                        <Form.Control.Feedback type="invalid">Every task needs a title!</Form.Control.Feedback>
                                        <Form.Control name="description" as="textarea" plaintext defaultValue={task.description} />
                                    </Form.Group >
                                    <Form.Group controlId="formProject">
                                        <Form.Label>Project</Form.Label>
                                        <Form.Control name='project_id' as="select"  >
                                            <option selected value={project.id}>{project.title}</option>
                                            {projects.map(project => <option value={project.id}>{project.title}</option>
                                            )}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">Assign the task to a Project</Form.Control.Feedback>
                                    </Form.Group>
                                    
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
                                        <Form.Label>Assigned To</Form.Label>
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
                        <Card.Footer className="d-flex justify-content-between modal-card-footer" as="h4" ><span onClick={() => setVisible(!visible)}><IoIosArrowBack /></span> <Button type="submit" ><FaSave /> </Button></Card.Footer>
                    </Form >
                </Card>
            </>
        )
    }
    
    return (
        <>
            <div className="projectdash ">
                <Jumbotron className="Jumbotron" fluid>
                    <Container>
                        <h1>{project.title} </h1>
                        <p>
                        {project.description}
                        </p>
                        <Row>
                            <Col className='col-5 text-center'>
                                <h3><Moment format="Do MMM">{project.startdate}</Moment></h3>
                            </Col>
                            <Col className='col-2 text-center'> 
                                <h3><FaLongArrowAltRight /></h3> 
                            </Col>
                            <Col className='col-5 text-center'>
                                <h3><Moment format="Do MMM">{project.enddate}</Moment></h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className="black-button" onClick={handleShow3}><FaEdit /></Button>
                            </Col>
                        </Row>

                    </Container>
                </Jumbotron>
                <Row className="pt-2 pb-2 m-0">
                    <Col xs={{span:8 ,offset:2}} md={{span:6 ,offset:3}} className="p-2 ">
                        <ProgressBar>
                                    <ProgressBar 
                                    className="project-card-progress-1 " animated variant="info" now={openTasks.length / totalTasks.length*100} 
                                    />
                                    <ProgressBar 
                                    className="project-card-progress-2 " animated variant="warning" now={inProgressTasks.length / totalTasks.length*100}
                                    />
                                    <ProgressBar 
                                    className="project-card-progress-3 " animated variant="success" now={doneTasks.length / totalTasks.length*100} 
                                    />
                        </ProgressBar>
                        </Col>
                </Row>
                <Row className='m-0 project-row' >
                    <Col xs={12} md={4} className=' open text-center h-auto'>
                        <h3> <FaRegLightbulb /> Open</h3>
                        <ColHeader />
                        {openTasks.map((task) => {
                            return (
                                <StyledTitleCard 
                                key={task.id}
                                task={task}
                                handleClick={() => handleClick(task) }
                                />
                            )
                        })}
                        <Button className="mb-4" variant="outline-primary" onClick={handleShow}  ><FaPlusCircle /> Task</Button>
                    </Col>
                    <Col xs={12} md={4} className=' open text-center h-auto'>
                        <h3> <FiActivity /> In Progress</h3>
                        <ColHeader />
                        {inProgressTasks.map((task) => {
                        return (
                            <StyledTitleCard 
                            key={task.id}
                            task={task}
                            handleClick={() => handleClick(task) }
                            />
                        )
                        })}

                    </Col>
                    <Col xs={12} md={4} className=' open text-center h-auto'>
                        <h3><FaRegCheckCircle /> Done</h3>
                        <ColHeader />
                        {doneTasks.map((task) => (
                            <StyledTitleCard 
                            key={task.id}
                            task={task}
                            handleClick={() => handleClick(task) }
                            />
                        )
                        )}
                    </Col>
                </Row>
            </div >
                        
            <Modal
                className="create-task-modal"
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show} onHide={handleClose}>
                <Form noValidate validated={validated} className="taskcreate " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleSubmit(e)}>
                    <h4>Create a new task </h4>
                    <img
                        src="/images/Logo.png"
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
                    <Form.Group controlId="formAssigned">
                                <Form.Control required name='assigned_id' as="select"  >
                                <option disabled selected value="">Assign the task</option>
                                                {props.allUsers.map(assignee=><option key={assignee.id} value={assignee.id}>{assignee.name}</option>
)}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">Assign the task to someone</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formProject">
                                        <Form.Label>Project</Form.Label>
                                        <Form.Control required name='project_id' as="select"  >
                                        <option disabled selected value="">Choose a Project</option>
                                            {projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>
                                            )}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">Assign the task to a Project</Form.Control.Feedback>
                                    </Form.Group>
                    <Button block size="lg" variant="success" type="submit"  >
                        Create
                    </Button>
                </Form>
            </Modal>

            <Modal
                className='modal2 edit-task'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show2} onHide={handleClose2}>
                {renderMainContent()}
            </Modal>

            <Modal
                className='modal3 edit-project'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={show3} onHide={handleClose3}>
                <>
                <Card className="modaltaskform ">
                    <Form noValidate validated={validated} className="modaltaskform " onChange={(e) => handleOnChange(e)} onSubmit={(e) => handleEditProjectSubmit(e)}>
                        <Card.Header className="d-flex justify-content-between modal-card-header" as="h4" >
                                            <span><IoIosGlasses />Edit {project.title}</span>
                        </Card.Header>
                        <Card.Body className="modal-card-body">
                            <Row>
                                <Col className='task-modal-left col-8'>
                                    <Form.Group controlId="formPlaintextEmail">
                                        <Form.Control required name="title" className='test h4' plaintext defaultValue={project.title} />
                                        <Form.Control.Feedback type="invalid">Every project needs a title!</Form.Control.Feedback>
                                        <Form.Control name="description" as="textarea" plaintext defaultValue={project.description} />
                                    </Form.Group >
                                </Col>
                                <Col className='col-4'>
                                    <Card.Text>
                                        <Form.Group controlId="formProjectStart">
                                            <Form.Label>Project Start Date</Form.Label>
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
                                        <Form.Group controlId="formProjectEnd">
                                            <Form.Label>Project Deadline</Form.Label>
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
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control name='status' as="select">
                                                <option>Open</option>
                                                <option>Complete</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end modal-card-footer" as="h4" > <Button type="submit" ><FaSave /> </Button></Card.Footer>
                    </Form >
                </Card>
            </>
            </Modal>
        </>
    );
}

export default ProjectDash