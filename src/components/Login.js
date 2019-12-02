import React from 'react';
import { Form, Button } from 'react-bootstrap';


const Login = () => {
    return (
<Form>
    <h1>Login</h1>
    <Form.Group controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Enter email" />
    </Form.Group>
    <Form.Group controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    <Button block size="lg" variant="success" type="submit">
        Login
    </Button>
    <Button block size="lg" variant="danger" href="/register" >Register</Button>
    
</Form>
    )
}
export default Login