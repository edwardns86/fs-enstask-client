import React, {useState} from 'react';
import { Row, Col, Form, Button} from 'react-bootstrap';


const Register = (props) => {
    // [props.user, props.setUser] = useState({})
    const [input,setInput] = useState({})
    const handleOnChange = (e) => {
        setInput({ ...input,
            [e.target.name]:e.target.value
        })
    }

    const registerUser = async (e) => {
        e.preventDefault()
        const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/register`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        })
        
        const data = await resp.json()
        if (data.success) {
            window.location.replace('/')
        }
      }


    return (
<Form className="signin-form" onChange={(e) => handleOnChange(e)}  onSubmit={(e) => registerUser(e)}>
    <h1>Register</h1>
    <img
                    src="/images/Logo.png"
                    width="100"
                    height="100"
                    className="d-inline-block align-top"
                    alt="logo"
                />
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
    <Button block size="lg" variant="success"type="submit">
        Register
    </Button>
    <Button block size="lg" variant="primary" href="/">Login</Button>
</Form>
    )
}
export default Register


