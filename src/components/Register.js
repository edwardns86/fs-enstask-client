import React, {useState} from 'react';
import { Row, Col, Form, Button} from 'react-bootstrap';


const Register = (props) => {
    // [props.user, props.setUser] = useState({})

    const handleOnChange = (event) => {
        console.log(props.user)
        props.setUser({
            ...props.user,
            [event.target.name] : event.target.value
        })
    }
    return (
<Form onChange={(e) => handleOnChange(e)} >
    <h1>Register</h1>
    <img className="mb-4" src="/client/src/images/Logo.png'" alt="" width="72" height="72" />
    <Row>
    <Col>
    <Form.Group controlId="formFirstname">
        <Form.Control name="name" type="Firstname" placeholder="First name" />
    </Form.Group>
    </Col>
        <Col>
        <Form.Group controlId="formSurname">
        <Form.Control name="surname" type="surname" placeholder="Surname" />
        </Form.Group>
        </Col>
    </Row>    
    <Form.Group controlId="formBasicEmail">
        <Form.Control name="email" type="email" placeholder="Enter email" />
    </Form.Group>
    <Row>
        <Col>
    <Form.Group controlId="formBasicPassword">
        <Form.Control name="password" type="password" placeholder="Password" />
    </Form.Group>
    </Col>
    <Col>
    <Form.Group controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Retype Password" />
    </Form.Group>
    </Col>
    </Row>
    <Button block size="lg" variant="success" type="submit">
        Register
    </Button>
    <Button block size="lg" variant="danger" href="/" >Login</Button>
</Form>
    )
}
export default Register


