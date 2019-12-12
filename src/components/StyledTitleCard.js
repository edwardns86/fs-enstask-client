import React from 'react'
import {Card, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Moment from 'react-moment';
import {FaRegLightbulb,FaRegCheckCircle} from 'react-icons/fa';
import { FiActivity } from "react-icons/fi";

const StyledCard = styled(Card)`
    background-color: ${props => props.status === "Done" ? "var(--main-green)" : props.status ==="In Progress" ? "var(--main-yellow)" : "var(--main-darkblue)"};
    color: black;
`;

export default function StyledTitleCard(props) {
    const icon =() => {
        if (props.task.status === 'Done') return (<FaRegCheckCircle />)
        if (props.task.status === 'In Progress') return (<FiActivity />)
        else return <FaRegLightbulb />

    }
    
    return (
        <StyledCard status={props.task.status} onClick={() => props.handleClick()} className="task-card  ">
                <Row>
                    <Col>
                    <Card.Body  className="p-2 task-card-body" >{props.task.title} </Card.Body>
                    </Col>
                    <Col>
                    <Card.Body  className="p-2 align-right" >
                        <Moment format="Do MMM">{props.task.enddate}</Moment>  {icon()}</Card.Body>
                    </Col>
                </Row>
        </StyledCard>
    )
}





