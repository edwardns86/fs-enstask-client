import React from 'react';
import { Button, Row , Col } from 'react-bootstrap';
// import Navi from './components/Navbar';

const ProjectDash = (props) => {
    return (
        <> 
        <div className="projectdash">
            <Row>
                <Col className='col-3'>
                    <h1>Open</h1>
                </Col>
                <Col className='col-3'>
                    <h1>In Progress</h1>
                </Col>
                <Col className='col-3'>
                    <h1>Done</h1>
                </Col>
                
            </Row>
        </div >
        </>
        );
        }
        
export default ProjectDash