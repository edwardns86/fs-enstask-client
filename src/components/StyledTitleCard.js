import React from 'react'
import {Card } from 'react-bootstrap';
import styled from 'styled-components'




const StyledCard = styled(Card)`
    color: ${props => props.status === "Done" ? "green" : props.status ==="In Progress" ? "blue" : "palevioletred"};

`;

export default function StyledTitleCard(props) {
    return (
        <StyledCard status={props.task.status} className="task-card m-2 text-center">
                    <Card.Title onClick={() => props.handleClick()} className="p-2" >{props.task.title}</Card.Title>
        </StyledCard>
    )
}





