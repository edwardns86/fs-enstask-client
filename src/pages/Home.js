import React , {useEffect} from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Calendar from '../components/Calendar';
import Projects from '../components/HomeProjects';
import HomeDashboard from '../components/HomeDashboard';
import { Switch, Route } from 'react-router-dom'

const Home = (props) => {
    useEffect(() => {
        props.getProjects();
    }, [])
    return (
        <>
            <Row style={{ height: '90vh' }}>
                <Col className='projects' md={2}>
                    <Projects
                        user={props.user}
                        projects={props.projects}
                    />
                </Col>
                <Col md='10'>
                    <Row style={{ height: '100vh' }}>
                        <Switch>
                            <Col className='m-0 p-0' md={8}>
                                <Route exact path='/' component={Calendar} />
                                <Route path='/stats' component={HomeDashboard} />
                            </Col>
                        </Switch >
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