import React from 'react'
import { Row, Col, Card,} from 'react-bootstrap';

export default function ColHeader() {
    return (
        <div>
            <Card className=" p-2 text-center task-col-header">
                <Row>
                    <Col>
                        <Card.Body className="p-2 task-header" >Title</Card.Body>
                    </Col>
                    <Col>
                        <Card.Body className="p-2 align-right" >Deadline</Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
